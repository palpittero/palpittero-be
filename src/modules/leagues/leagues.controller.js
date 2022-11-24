import jwt from 'jsonwebtoken'
import difference from 'lodash/fp/difference'
import uniqBy from 'lodash/fp/uniqBy'
import leaguesModel from '../../models/leagues.model'
import usersModel from '../../models/users.model'
import usersLeaguesModel from '../../models/usersLeagues.model'
import leaguesInvitationsModel from '../../models/leaguesInvitations.model'
import leaguesChampionshipsModel from '../../models/leaguesChampionships.model'
import championshipsModel from '../../models/championships.model'
import { appendUsersLeagues } from '../usersLeagues/usersLeagues.helpers'
import { appendLeaguesChampionships } from '../leaguesChampionships/leaguesChampionships.helpers'
import {
  sendAnonymousLeagueInvitationEmail,
  sendLeagueInvitationEmail
} from '../email/email.service'
import { EMAIL_LEAGUE_VISIBILITY } from '../email/email.constants'
import { safeJSONParse } from '../../utils/misc'
import { USERS_LEAGUES_STATUSES } from '../usersLeagues/usersLeagues.constants'
import { LEAGUES_INVITATIONS_STATUSES } from '../leaguesInvitations/leaguesInvitations.constants'

const getLeagues = async (req, res) => {
  const { private: isPrivate, ownerId } = req.query
  const leagues = await leaguesModel.fetchAll({ isPrivate, ownerId })

  res.json({
    data: leagues
  })
}

const getLeague = async (req, res) => {
  const id = parseInt(req.params.id)

  const league = await leaguesModel.fetchById(id)

  if (!league) {
    return res.sendStatus(404)
  }

  const leaguesInvitations = await leaguesInvitationsModel.fetchAll({
    leagueId: id
  })

  return res.json({
    data: {
      ...league,
      users: [...league.users, ...leaguesInvitations]
    }
  })
}

const createLeague = async (req, res) => {
  const {
    name,
    pointsStrategy,
    private: isPrivate,
    users: rawUsers,
    championships: rawChampionships,
    status
  } = req.body

  const users = safeJSONParse(rawUsers)
  const championships = safeJSONParse(rawChampionships)

  const badge = req.file?.path ? req.file?.path : req.body.badge
  const ownerId = users.find(({ owner }) => owner)?.id || res.locals.jwt.user.id

  const visibility = isPrivate
    ? EMAIL_LEAGUE_VISIBILITY.PRIVATE
    : EMAIL_LEAGUE_VISIBILITY.PUBLIC

  const [leagueId] = await leaguesModel.insert({
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    status
  })

  const leaguesChampionships = appendLeaguesChampionships({
    leagueId,
    championships
  })

  await leaguesChampionshipsModel.replace(leaguesChampionships)

  const existingUsers = users.filter((user) => user?.id)
  const nonExistingUsers = users.filter((user) => !user?.id)

  if (existingUsers.length > 0) {
    const usersLeagues = appendUsersLeagues({
      leagueId,
      users: existingUsers,
      ownerId
    })

    await usersLeaguesModel.replace(usersLeagues)

    existingUsers.map(async (user) => {
      if (!user.owner) {
        const token = jwt.sign(
          { email: user.email, leagueId },
          process.env.AUTH_TOKEN_SECRET,
          {
            expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
          }
        )

        sendLeagueInvitationEmail({
          name: user.name,
          email: user.email,
          league: name,
          owner: res.locals.jwt.user.name,
          visibility,
          token
        })
      }
    })
  }

  nonExistingUsers.map(async (user) => {
    const token = jwt.sign(
      { email: user, leagueId },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
      }
    )

    await leaguesInvitationsModel.replace({ email: user, leagueId })

    await sendAnonymousLeagueInvitationEmail({
      email: user,
      league: name,
      owner: res.locals.jwt.user.name,
      visibility,
      token
    })

    await leaguesInvitationsModel.replace({
      email: user,
      leagueId,
      status: LEAGUES_INVITATIONS_STATUSES.SENT
    })
  })

  res.status(201).json({ data: leagueId })
}

const updateLeague = async (req, res) => {
  const leagueId = parseInt(req.params.id)

  const {
    name,
    pointsStrategy,
    private: isPrivate,
    users: rawUsers,
    championships: rawChampionships,
    status,
    resendInvitations
  } = req.body

  const league = await leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
  }

  const users = safeJSONParse(rawUsers)
  const championships = safeJSONParse(rawChampionships)

  const badge = req.file?.path ? req.file?.path : req.body.badge3
  const ownerId = users.find(({ owner }) => owner)?.id || res.locals.jwt.user.id

  const visibility = isPrivate
    ? EMAIL_LEAGUE_VISIBILITY.PRIVATE
    : EMAIL_LEAGUE_VISIBILITY.PUBLIC

  await leaguesModel.update({
    id: leagueId,
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    status
  })

  const leaguesChampionships = appendLeaguesChampionships({
    leagueId,
    championships
  })

  await leaguesChampionshipsModel.replace(leaguesChampionships)

  const existingUsers = users.filter((user) => user?.id)
  const existingNonLeagueUsers = existingUsers.filter(
    (user) => !user.status && !user?.owner
  )

  await usersLeaguesModel.deleteByLeague(leagueId)

  if (existingUsers.length > 0) {
    const usersLeagues = appendUsersLeagues({
      leagueId,
      users: existingUsers,
      ownerId
    })

    await usersLeaguesModel.replace(usersLeagues)
  }

  const existingInvitedLeagueUsers = users.filter(
    (user) =>
      user?.name &&
      !user.owner &&
      user?.status === USERS_LEAGUES_STATUSES.INVITED
  )

  const existingUsersToBeInvited = resendInvitations
    ? [...existingNonLeagueUsers, ...existingInvitedLeagueUsers]
    : existingNonLeagueUsers

  existingUsersToBeInvited.map((user) => {
    const token = jwt.sign(
      { email: user.email, leagueId },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
      }
    )

    sendLeagueInvitationEmail({
      name: user.name,
      email: user.email,
      league: name,
      owner: res.locals.jwt.user.name,
      visibility,
      token
    })
  })

  const nonExistingUsers = users.filter((user) => !user?.name && !user.owner)
  const nonExistingUsersEmails = nonExistingUsers.map(
    (user) => user?.email || user
  )
  const nonExistingUninvitedUsers = nonExistingUsers.filter(
    (user) =>
      !user?.status || user?.status === LEAGUES_INVITATIONS_STATUSES.PENDING
  )
  const nonExistingUsersToBeInvited = resendInvitations
    ? nonExistingUsers
    : nonExistingUninvitedUsers

  const leaguesInvitationsEmails = (
    await leaguesInvitationsModel.fetchAll({ leagueId })
  ).map(({ email }) => email)

  const leaguesInvitationsToBeDeleted = difference(
    leaguesInvitationsEmails,
    nonExistingUsersEmails
  )

  await leaguesInvitationsModel.batchDeleteByLeagueAndEmails({
    leagueId,
    emails: leaguesInvitationsToBeDeleted
  })

  nonExistingUsersToBeInvited.map(async (user) => {
    const token = jwt.sign(
      { email: user?.email || user, leagueId },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
      }
    )

    if (!user?.email) {
      await leaguesInvitationsModel.replace({ email: user, leagueId })
    }

    await sendAnonymousLeagueInvitationEmail({
      email: user?.email || user,
      league: name,
      owner: res.locals.jwt.user.name,
      visibility,
      token
    })

    await leaguesInvitationsModel.replace({
      email: user?.email || user,
      leagueId,
      status: LEAGUES_INVITATIONS_STATUSES.SENT
    })
  })

  return res.json({
    data: leagueId
  })
}

const deleteLeague = async (req, res) => {
  const id = parseInt(req.params.id)
  const league = await leaguesModel.fetchById(id)

  if (!league) {
    return res.sendStatus(404)
  }

  await leaguesModel.delete({ id })
  return res.sendStatus(204)
}

const deleteLeagues = async (req, res) => {
  const { ids } = req.body

  await leaguesModel.batchDelete({ values: ids })

  return res.sendStatus(204)
}

const getLeagueUsers = async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.query

  const league = await leaguesModel.fetchById(id)

  if (!league) {
    return res.sendStatus(404)
  }

  const leagueUsers = await usersModel.fetchByLeague({ leagueId: id, status })

  const leaguesInvitations = status
    ? []
    : (
        await leaguesInvitationsModel.fetchAll({
          leagueId: id
        })
      ).filter(
        (leagueInvitation) => !status || status === leagueInvitation.status
      )

  const users = uniqBy('email', [...leagueUsers, ...leaguesInvitations])
  return res.json({
    data: users
  })
}

const getLeagueChampionships = async (req, res) => {
  const { id } = req.params

  const league = await leaguesModel.fetchById(id)

  if (!league) {
    return res.sendStatus(404)
  }

  const leagueChampionships = await championshipsModel.fetchByLeague({
    leagueId: id
  })

  return res.json({
    data: leagueChampionships
  })
}

const getLoggedUserLeagues = async (req, res) => {
  const { status } = req.query
  const userId = res.locals.jwt.user.id
  const leagues = await leaguesModel.fetchAll({
    userId,
    status
  })

  res.json({
    data: leagues
  })
}

const getPublicLeagues = async (req, res) => {
  const leagues = await leaguesModel.fetchAll({ isPrivate: 0 })

  res.json({
    data: leagues
  })
}

export {
  getLeagues,
  getLeague,
  createLeague,
  updateLeague,
  deleteLeague,
  deleteLeagues,
  getLeagueUsers,
  getLeagueChampionships,
  getLoggedUserLeagues,
  getPublicLeagues
}

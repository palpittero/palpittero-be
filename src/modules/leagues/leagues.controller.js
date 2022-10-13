import jwt from 'jsonwebtoken'
import leaguesModel from '../../models/leagues.model'
import usersModel from '../../models/users.model'
import usersLeaguesModel from '../../models/usersLeagues.model'
import { appendUsersLeagues } from '../usersLeagues/usersLeagues.helpers'
import { appendLeaguesChampionships } from '../leaguesChampionships/leaguesChampionships.helpers'
import leaguesChampionshipsModel from '../../models/leaguesChampionships.model'
import championshipsModel from '../../models/championships.model'
import {
  sendAnonymousLeagueInvitationEmail,
  sendLeagueInvitationEmail
} from '../email/email.service'
import { EMAIL_LEAGUE_VISIBILITY } from '../email/email.constants'
import { safeJSONParse } from '../../utils/misc'
import difference from 'lodash/fp/difference'
import leaguesInvitationsModel from '../../models/leaguesInvitations.model'

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

  const invitations = leaguesInvitations.map(({ email }) => email)

  return res.json({
    data: {
      ...league,
      users: [...league.users, ...invitations]
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

  nonExistingUsers.map(async (user) => {
    const token = jwt.sign(
      { email: user, leagueId },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
      }
    )

    await leaguesInvitationsModel.replace({ email: user, leagueId })

    sendAnonymousLeagueInvitationEmail({
      email: user,
      league: name,
      owner: res.locals.jwt.user.name,
      visibility,
      token
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
    status
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
  const existingUsersIds = existingUsers.map(({ id }) => id)

  const usersLeagues = appendUsersLeagues({
    leagueId,
    users: existingUsers,
    ownerId
  })

  await usersLeaguesModel.deleteByLeague(leagueId)
  await usersLeaguesModel.replace(usersLeagues)

  const currentUsersLeagues = await usersLeaguesModel.fetchByLeague({
    id: leagueId
  })

  const currentUsersIds = currentUsersLeagues.map(({ userId }) => userId)
  const addedUsersIds = difference(existingUsersIds, currentUsersIds)

  const addedUsers = await usersModel.fetchAll({ id: addedUsersIds })

  addedUsers
    .filter(({ owner }) => !owner)
    .map((user) => {
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

  const nonExistingUsers = users.filter((user) => !user?.id)
  nonExistingUsers.map(async (user) => {
    const token = jwt.sign(
      { email: user, leagueId },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
      }
    )

    await leaguesInvitationsModel.replace({ email: user, leagueId })

    sendAnonymousLeagueInvitationEmail({
      email: user,
      league: name,
      owner: res.locals.jwt.user.name,
      visibility,
      token
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
  const { id } = req.params
  const { status } = req.query

  const league = await leaguesModel.fetchById(id)

  if (!league) {
    return res.sendStatus(404)
  }

  const leagueUsers = await usersModel.fetchByLeague({ leagueId: id, status })

  return res.json({
    data: leagueUsers
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

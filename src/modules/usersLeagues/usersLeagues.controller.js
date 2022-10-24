import jwt from 'jsonwebtoken'
import usersLeaguesModel from '../../models/usersLeagues.model'
import leaguesModel from '../../models/leagues.model'
import { USERS_LEAGUES_STATUSES } from './usersLeagues.constants'
import { validateAuthenticatedToken } from '../../shared/token.service'
import usersModel from '../../models/users.model'
import {
  sendAnonymousLeagueInvitationEmail,
  sendLeagueInvitationEmail
} from '../email/email.service'
import { EMAIL_LEAGUE_VISIBILITY } from '../email/email.constants'
import { appendUsersLeagues } from './usersLeagues.helpers'
import leaguesInvitationsModel from '../../models/leaguesInvitations.model'
import { LEAGUES_INVITATIONS_STATUSES } from '../leaguesInvitations/leaguesInvitations.constants'

const inviteUsers = async (req, res) => {
  const { leagueId, users } = req.body

  const league = await leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
  }

  const visibility = league.private
    ? EMAIL_LEAGUE_VISIBILITY.PRIVATE
    : EMAIL_LEAGUE_VISIBILITY.PUBLIC

  const existingUsers = users.filter((user) => user?.id)
  const nonExistingUsers = users.filter((user) => !user?.id)

  if (existingUsers.length > 0) {
    const usersLeagues = appendUsersLeagues({
      leagueId,
      users: existingUsers
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
          league: league.name,
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
      league: league.name,
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

  res.sendStatus(201)
}

const acceptInvitation = async (req, res) => {
  const { token } = req.params
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateAuthenticatedToken({
    token,
    secret,
    user: res.locals.jwt.user
  })

  if (!tokenValidation) {
    return res.sendStatus(400)
  }

  const { email, leagueId } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  const userLeague = await usersLeaguesModel.fetchByUser({ id: user.id })

  if (userLeague?.status === USERS_LEAGUES_STATUSES.APPROVED) {
    // await leaguesInvitationsModel.delete({
    //   leagueId,
    //   email: user.email
    // })

    return res.sendStatus(200)
  }

  await usersLeaguesModel.replace({
    leagueId,
    userId: user.id,
    status: USERS_LEAGUES_STATUSES.APPROVED
  })

  // await leaguesInvitationsModel.delete({
  //   leagueId,
  //   email: user.email
  // })

  return res.sendStatus(200)
}

const updateInvitations = async (req, res) => {
  const { invitations } = req.body
  const userId = res.locals.jwt.user.id

  const acceptedInvitations = Object.values(invitations)
    .filter(({ status }) => status)
    .map(({ leagueId }) => ({
      leagueId,
      userId,
      status: USERS_LEAGUES_STATUSES.APPROVED
    }))

  if (acceptedInvitations.length > 0) {
    await usersLeaguesModel.replace(acceptedInvitations)
  }

  const pendingInvitations = await usersLeaguesModel.fetchAll({
    userId,
    status: USERS_LEAGUES_STATUSES.INVITED
  })

  const rejectedInvitationsLeaguesIds = Object.values(invitations)
    .filter(({ status }) => !status)
    .map(({ leagueId }) => leagueId)

  const pendingInvitationsIds = pendingInvitations
    .filter(({ leagueId }) => rejectedInvitationsLeaguesIds.includes(leagueId))
    .map(({ id }) => id)

  await usersLeaguesModel.batchDelete({
    columnName: 'id',
    values: pendingInvitationsIds
  })

  return res.sendStatus(200)
}

const deleteUser = async (req, res) => {
  const { leagueId, userId } = req.params

  await usersLeaguesModel.delete({
    leagueId,
    userId
  })

  res.sendStatus(200)
}

const joinLeague = async (req, res) => {
  const leagueId = parseInt(req.params.leagueId)
  const userId = res.locals.jwt.user.id

  const league = await leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
  }

  // ToDo - check proper status
  if (league.private) {
    return res.sendStatus(422)
  }

  const userLeague = {
    userId,
    leagueId,
    status: USERS_LEAGUES_STATUSES.APPROVED
  }

  await usersLeaguesModel.replace([userLeague])

  return res.sendStatus(200)
}

const approveUsers = async (req, res) => {
  const leagueId = parseInt(req.params.leagueId)
  const { users } = req.body

  const league = await leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
  }

  const usersLeagues = appendUsersLeagues({
    leagueId,
    users
  })

  await usersLeaguesModel.replace(usersLeagues)

  return res.sendStatus(200)
}

export {
  inviteUsers,
  acceptInvitation,
  deleteUser,
  updateInvitations,
  joinLeague,
  approveUsers
}

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import usersModel from '../../models/users.model'
import omit from 'lodash/fp/omit'
import { generateTokens } from '../../utils/auth'
import { STATUS } from '../../shared/constants'
import {
  sendAccountCreationEmail,
  sendLeagueInvitationEmail,
  sendPasswordResetEmail
} from '../email/email.service'
import { validateAnonymousToken } from '../../shared/token.service'
import { USER_ROLES } from '../users/users.constants'
import leaguesInvitationsModel from '../../models/leaguesInvitations.model'
import { LEAGUES_INVITATIONS_STATUSES } from '../leaguesInvitations/leaguesInvitations.constants'
import usersLeaguesModel from '../../models/usersLeagues.model'
import { appendUsersLeagues } from '../usersLeagues/usersLeagues.helpers'
import { USERS_LEAGUES_STATUSES } from '../usersLeagues/usersLeagues.constants'
import leaguesModel from '../../models/leagues.model'
import { EMAIL_LEAGUE_VISIBILITY } from '../email/email.constants'

const authenticate = async (req, res) => {
  const { email, password } = req.body

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.sendStatus(401)
  }

  if (user.status !== STATUS.ACTIVE) {
    return res.sendStatus(403)
  }

  const { accessToken, refreshToken } = generateTokens(user)

  res.json({
    data: {
      accessToken,
      refreshToken
    }
  })
}

const refreshToken = async (req, res) => {
  const { authorization } = req.headers

  jwt.verify(
    authorization.replace('Bearer ', ''),
    process.env.AUTH_ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }

      const { accessToken, refreshToken } = generateTokens(user)

      return res.json({ accessToken, refreshToken })
    }
  )
}

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await usersModel.fetchById(res.locals.jwt.user.id)

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

  if (!isPasswordCorrect) {
    return res.sendStatus(400)
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPassword, salt, async (err, hash) => {
      await usersModel.update({
        id: user.id,
        password: hash
      })

      res.status(200)
    })
  })

  return res.sendStatus(200)
}

const getLoggedUser = async (req, res) => {
  const user = await usersModel.fetchById(res.locals.jwt.user.id)

  res.json({
    data: omit('password', user)
  })
}

const signUp = async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirmation,
    phone,
    status = STATUS.INACTIVE,
    role = USER_ROLES.PLAYER
  } = req.body

  if (password !== passwordConfirmation) {
    return res.sendStatus(400)
  }

  const user = await usersModel.fetchByEmail(email.toLowerCase())

  if (user) {
    return res.sendStatus(409)
  }

  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)

  const token = jwt.sign({ email }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
  })

  await usersModel.insert({
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    token,
    role,
    phone,
    status
  })

  await sendAccountCreationEmail({ name, email, token })

  return res.sendStatus(201)
}

const activateAccount = async (req, res) => {
  const { token } = req.params
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateAnonymousToken({
    token,
    secret
  })

  if (!tokenValidation) {
    return res.sendStatus(400)
  }

  const { email } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  if (user.status === STATUS.INACTIVE) {
    await usersModel.update({
      id: user.id,
      token: null,
      status: STATUS.ACTIVE
    })
  }

  const leaguesInvitations = await leaguesInvitationsModel.fetchAll({
    email: user.email,
    status: LEAGUES_INVITATIONS_STATUSES.SENT
  })

  const leaguesInvitationsIds = leaguesInvitations.map(({ id }) => id)

  const leaguesInvitationsLeaguesIds = leaguesInvitations.map(
    ({ leagueId }) => leagueId
  )

  if (leaguesInvitations.length > 0) {
    const leagues = await leaguesModel.fetchByIds(leaguesInvitationsLeaguesIds)

    leagues.map(async (league) => {
      const visibility = league.private
        ? EMAIL_LEAGUE_VISIBILITY.PRIVATE
        : EMAIL_LEAGUE_VISIBILITY.PUBLIC

      const owner = league.users.find(({ owner }) => owner)?.name

      const usersLeagues = appendUsersLeagues({
        leagueId: league.id,
        users: [
          {
            ...user,
            status: USERS_LEAGUES_STATUSES.INVITED
          }
        ]
      })

      const token = jwt.sign(
        { email: user.email, leagueId: league.id },
        process.env.AUTH_TOKEN_SECRET,
        {
          expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
        }
      )

      sendLeagueInvitationEmail({
        name: user.name,
        email: user.email,
        league: league.name,
        owner,
        visibility,
        token
      })

      await usersLeaguesModel.replace(usersLeagues)
    })

    await leaguesInvitationsModel.batchDelete({
      columnName: 'id',
      values: leaguesInvitationsIds
    })
  }

  return res.sendStatus(200)
}

const recoverPassword = async (req, res) => {
  const { email } = req.body

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  const token = jwt.sign({ email }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
  })

  await sendPasswordResetEmail({ name: user.name, email, token })

  return res.sendStatus(200)
}

const resetPassword = async (req, res) => {
  const { token, password, passwordConfirmation } = req.body
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateAnonymousToken({
    token,
    secret
  })

  if (!tokenValidation) {
    return res.sendStatus(400)
  }

  if (password !== passwordConfirmation) {
    return res.sendStatus(400)
  }

  const { email } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)

  await usersModel.update({
    id: user.id,
    token: null,
    password: passwordHash
  })

  return res.sendStatus(200)
}

const validate = async (req, res) => {
  const { token } = req.params
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateAnonymousToken({
    token,
    secret
  })

  if (!tokenValidation) {
    return res.sendStatus(422)
  }

  const { email } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  return res.sendStatus(200)
}

export {
  authenticate,
  refreshToken,
  updatePassword,
  getLoggedUser,
  signUp,
  recoverPassword,
  activateAccount,
  resetPassword,
  validate
}

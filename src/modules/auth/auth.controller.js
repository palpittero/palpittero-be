import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import usersModel from '../../models/users.model'
import omit from 'lodash/fp/omit'
import { generateTokens } from '../../utils/auth'
import { STATUS } from '../../shared/constants'
import {
  sendAccountCreationEmail,
  sendPasswordResetEmail
} from '../email/email.service'
import { validateToken } from '../../shared/token.service'
import { USER_ROLES } from '../users/users.constants'

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
  const { password, newPassword } = req.body
  const user = await usersModel.fetchById(res.locals.jwt.user.id)

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.sendStatus(401)
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPassword, salt, async (err, hash) => {
      const [id] = await usersModel.update({
        id: user.id,
        password: hash
      })

      res.status(201).json({ data: id })
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

  const user = await usersModel.fetchByEmail(email)

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
    email,
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

  const tokenValidation = validateToken({
    token,
    secret,
    user: res.locals.jwt.user
  })

  if (!tokenValidation) {
    return res.sendStatus(400)
  }

  const { email } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  if (user.status === STATUS.ACTIVE) {
    return res.sendStatus(200)
  }

  await usersModel.update({
    id: user.id,
    token: null,
    status: STATUS.ACTIVE
  })

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

  const tokenValidation = validateToken({
    token,
    secret,
    user: res.locals.jwt.user
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

  const tokenValidation = validateToken({
    token,
    secret,
    user: res.locals.jwt.user
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

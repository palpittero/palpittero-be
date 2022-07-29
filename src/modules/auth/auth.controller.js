import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import usersModel from '../../models/users.model'
import omit from 'lodash/fp/omit'
import { generateTokens } from '../../utils/auth'

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

  res.json()
}

const getLoggedUser = async (req, res) => {
  const user = await usersModel.fetchById(res.locals.jwt.user.id)

  res.json({
    data: omit('password', user)
  })
}

const signUp = async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body

  if (password !== passwordConfirmation) {
    return res.status(400).json()
  }

  const user = await usersModel.fetchByEmail(email)

  if (user) {
    return res.status(429).json()
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      await usersModel.insert({
        name,
        email,
        password: hash
      })

      res.status(201).json()
    })
  })
}

const recoverPassword = async (req, res) => {
  const { email } = req.body

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.status(404).json()
  }

  // Todo
  return res.send(200)
}

export {
  authenticate,
  refreshToken,
  updatePassword,
  getLoggedUser,
  signUp,
  recoverPassword
}

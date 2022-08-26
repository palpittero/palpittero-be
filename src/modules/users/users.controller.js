import omit from 'lodash/fp/omit'
import usersModel from '../../models/users.model'
import usersLeaguesModel from '../../models/usersLeagues.model'
import { signUp } from '../auth/auth.controller'
import {
  sendEmailActivationEmail,
  sendEmailChangeEmail
} from '../email/email.service'

const getUsers = async (req, res) => {
  const users = await usersModel.fetchAll()

  res.json({
    data: users.map(omit('password'))
  })
}

const getUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await usersModel.fetchById(id)

  if (!user) {
    return res.sendStatus(404)
  }

  return res.json({
    data: user
  })
}

const createUser = signUp

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, phone, status, role } = req.body

  const user = await usersModel.fetchById(id)

  if (!user) {
    return res.sendStatus(404)
  }

  const userByEmail = await usersModel.fetchByEmail(email)

  if (userByEmail && userByEmail.id !== id) {
    return res.sendStatus(409)
  }

  await usersModel.update({
    id,
    name,
    email,
    phone,
    role,
    status
  })

  if (email !== user.email) {
    await sendEmailChangeEmail({ name, email })
    await sendEmailActivationEmail({ name, email })
  }

  return res.json({
    data: id
  })
}

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await usersModel.fetchById(id)

  if (!user) {
    return res.sendStatus(404)
  }

  await usersModel.delete({ id })
  return res.sendStatus(204)
}

const getUserLeagues = async (req, res) => {
  const { id } = req.params
  const { status } = req.query

  const user = await usersModel.fetchById(id)

  if (!user) {
    return res.sendStatus(404)
  }

  const userLeagues = await usersLeaguesModel.fetchByUser({ id, status })

  res.json({
    data: userLeagues
  })
}

export { getUsers, getUser, createUser, updateUser, deleteUser, getUserLeagues }

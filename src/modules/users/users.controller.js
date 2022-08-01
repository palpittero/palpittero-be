import bcrypt from 'bcrypt'
import omit from 'lodash/fp/omit'
import usersModel from '../../models/users.model'
import usersLeaguesModel from '../../models/usersLeagues.model'

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

const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.status(404).json()
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const [id] = await usersModel.insert({
        name,
        email,
        password: hash,
        phone
      })

      res.status(201).json({ data: id })
    })
  })
}

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, phone, status } = req.body

  const user = await usersModel.fetchById(id)

  if (!user) {
    return res.sendStatus(404)
  }

  const userByEmail = await usersModel.fetchByEmail(email)

  if (userByEmail && userByEmail.id !== id) {
    return res.status(409).json()
  }

  await usersModel.update({
    id,
    name,
    email,
    phone,
    status
  })

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
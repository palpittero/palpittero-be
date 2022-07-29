import leaguesModel from '../../models/leagues.model'
import usersModel from '../../models/users.model'
import usersLeaguesModel from '../../models/usersLeagues.model'
import { appendUsersLeagues } from '../usersLeagues/usersLeagues.helpers'
import { appendLeaguesChampionships } from '../leaguesChampionships/leaguesChampionships.helpers'
import leaguesChampionshipsModel from '../../models/leaguesChampionships.model'
import championshipsModel from '../../models/championships.model'

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

  return res.json({
    data: league
  })
}

const createLeague = async (req, res) => {
  const {
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    users,
    championships,
    status
  } = req.body

  const [leagueId] = await leaguesModel.insert({
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    status
  })

  const ownerId = res.locals.jwt.user.id
  const usersLeagues = appendUsersLeagues({ leagueId, users, ownerId })

  await usersLeaguesModel.replace(usersLeagues)

  const leaguesChampionships = appendLeaguesChampionships({
    leagueId,
    championships
  })

  await leaguesChampionshipsModel.replace(leaguesChampionships)

  res.status(201).json({ data: leagueId })
}

const updateLeague = async (req, res) => {
  const leagueId = parseInt(req.params.id)
  const {
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    users,
    championships,
    status
  } = req.body

  const league = await leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
  }

  await leaguesModel.update({
    id: leagueId,
    name,
    badge,
    pointsStrategy,
    private: isPrivate,
    status
  })

  const ownerId = res.locals.jwt.user.id
  const usersLeagues = appendUsersLeagues({ leagueId, users, ownerId })

  console.log(usersLeagues)

  await usersLeaguesModel.replace(usersLeagues)

  const leaguesChampionships = appendLeaguesChampionships({
    leagueId,
    championships
  })

  await leaguesChampionshipsModel.replace(leaguesChampionships)

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

const getPublicLeagues = async (req, res) => {
  const leagues = await leaguesModel.fetchAll({ isPrivate: 0 })

  res.json({
    data: leagues
  })
}

const getLoggedUserLeagues = async (req, res) => {
  const userId = res.locals.jwt.user.id
  const leagues = await leaguesModel.fetchAll({ userId })

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
  getLeagueUsers,
  getLeagueChampionships,
  getLoggedUserLeagues,
  getPublicLeagues
}

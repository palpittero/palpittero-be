import championshipsModel from '../../models/championships.model'
import teamsChampionshipsModel from '../../models/teamsChampionships.model'
import roundsModel from '../../models/rounds.model'
import teamsModel from '../../models/teams.model'
import matchesModel from '../../models/matches.model'
import {
  appendTeamsChampionships,
  appendChampionshipRounds
} from '../teamsChampionships/teamsChampionships.helpers'
import minBy from 'lodash/fp/minBy'
import maxBy from 'lodash/fp/maxBy'

const getChampionships = async (req, res) => {
  const { query } = req

  const championships = await championshipsModel.fetchAll(query)

  res.json({
    data: championships
  })
}

const getChampionship = async (req, res) => {
  const id = parseInt(req.params.id)
  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  return res.json({
    data: championship
  })
}

const createChampionship = async (req, res) => {
  const { name, year, teams, rounds } = req.body

  const [id] = await championshipsModel.insert({
    name,
    year
  })

  const championshipRounds = appendChampionshipRounds({
    championshipId: id,
    rounds
  })

  await roundsModel.replace(championshipRounds)

  const teamsChampionships = appendTeamsChampionships({
    championshipId: id,
    teams
  })

  await teamsChampionshipsModel.replace(teamsChampionships)

  res.status(201).json({ data: id })
}

const updateChampionship = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, year, teams, status } = req.body

  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  await championshipsModel.update({
    id,
    name,
    year,
    status
  })

  const teamsChampionships = appendTeamsChampionships({
    championshipId: id,
    teams
  })

  await teamsChampionshipsModel.replace(teamsChampionships)

  return res.json({
    data: id
  })
}

const deleteChampionship = async (req, res) => {
  const id = parseInt(req.params.id)
  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  await championshipsModel.delete({ id })
  return res.sendStatus(204)
}

const getChampionshipRounds = async (req, res) => {
  const { id } = req.params

  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  const championshipRounds = await roundsModel.fetchByChampionship({
    championshipId: id
  })

  const championshipMatches = await matchesModel.fetchByChampionship({
    championshipId: id
  })

  const firstRoundId = minBy('code', championshipRounds)?.id

  const lastRoundId = maxBy('code', championshipRounds)?.id

  const currentRoundId = minBy(
    'roundId',
    championshipMatches.filter((match) => match.status === 'scheduled')
  )?.roundId

  return res.json({
    data: championshipRounds.map((round) => ({
      ...round,
      first: round.id === firstRoundId,
      last: round.id === lastRoundId,
      current: round.id === currentRoundId || round.id === lastRoundId
    }))
  })
}

const getChampionshipTeams = async (req, res) => {
  const { id } = req.params

  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  const championshipTeams = await teamsModel.fetchByChampionship(id)

  return res.json({
    data: championshipTeams
  })
}

export {
  getChampionships,
  getChampionship,
  createChampionship,
  updateChampionship,
  deleteChampionship,
  getChampionshipRounds,
  getChampionshipTeams
}

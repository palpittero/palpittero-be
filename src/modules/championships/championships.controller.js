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
import { CHAMPIONSHIPS_ROUNDS } from './championships.constants'

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
  const { name, year, teams, rounds, roundsType } = req.body

  const [id] = await championshipsModel.insert({
    name,
    year
  })

  const championshipRounds = appendChampionshipRounds({
    championshipId: id,
    rounds,
    roundsType
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
  const { name, year, teams, rounds, status } = req.body

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

  await roundsModel.batchDelete({ columnName: 'championshipId', values: [id] })

  const championshipRounds = appendChampionshipRounds({
    championshipId: id,
    rounds,
    roundsType: CHAMPIONSHIPS_ROUNDS.DETAILED
  })

  await roundsModel.batchInsert(championshipRounds)

  const teamsChampionships = appendTeamsChampionships({
    championshipId: id,
    teams
  })

  await teamsChampionshipsModel.batchDelete({
    columnName: 'championshipId',
    values: [id]
  })

  await teamsChampionshipsModel.batchInsert(teamsChampionships)

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

const deleteChampionships = async (req, res) => {
  const { ids } = req.body

  await championshipsModel.batchDelete({ values: ids })
  await teamsChampionshipsModel.batchDelete({
    columnName: 'championshipId',
    values: ids
  })

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
      current: round.id === currentRoundId
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
  deleteChampionships,
  getChampionshipRounds,
  getChampionshipTeams
}

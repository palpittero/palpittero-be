import uniq from 'lodash/fp/uniq'
import compact from 'lodash/fp/compact'
import pick from 'lodash/fp/pick'
import uniqBy from 'lodash/fp/uniqBy'

import matchesModel from '../../models/matches.model'
import teamsModel from '../../models/teams.model'

const getMatches = async (req, res) => {
  const { status, date, roundId } = req.query
  const matches = await matchesModel.fetchAll({ status, date, roundId })

  const championshipsIds = uniq(
    compact(matches.map(({ round }) => round?.championship?.id))
  )

  const championshipsTeams = await teamsModel.fetchByChampionships(
    championshipsIds
  )

  const parsedMatches = matches.map((match) => {
    const teams = championshipsTeams.filter(
      ({ groupId }) => match.group?.id === groupId
    )

    return {
      ...match,
      group: {
        ...match.group,
        teams: teams.map(pick(['id', 'name', 'badge']))
      }
    }
  })

  res.json({
    data: uniqBy('id', parsedMatches)
    // championshipsTeams
  })
}

const getMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  return res.json({
    data: match
  })
}

const createMatch = async (req, res) => {
  const { roundId, homeTeamId, awayTeamId, date } = req.body

  const parsedDate = new Date(date)

  const [id] = await matchesModel.insert({
    roundId,
    homeTeamId,
    awayTeamId,
    date: parsedDate
  })

  res.status(200).json({ data: id })
}

const createMatches = async (req, res) => {
  const { roundId, details } = req.body

  const matches = details.map(({ homeTeamId, awayTeamId, date }) => ({
    homeTeamId,
    awayTeamId,
    roundId,
    date: new Date(date)
  }))

  await matchesModel.batchInsert(matches)

  res.status(200).json()
}

const updateMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  const {
    roundId,
    homeTeamId,
    awayTeamId,
    date,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals,
    extraTimeHomeTeamGoals,
    extraTimeAwayTeamGoals,
    penaltiesTimeHomeTeamGoals,
    penaltiesTimeAwayTeamGoals,
    result,
    resetStatus
  } = req.body

  const status = resetStatus ? null : req.body.status
  const parsedDate = new Date(date)

  await matchesModel.update({
    id,
    roundId,
    homeTeamId,
    awayTeamId,
    date: parsedDate,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals,
    extraTimeHomeTeamGoals,
    extraTimeAwayTeamGoals,
    penaltiesTimeHomeTeamGoals,
    penaltiesTimeAwayTeamGoals,
    result,
    // resetStatus,
    status
  })

  return res.json({
    data: id
  })
}

const deleteMatch = async (req, res) => {
  const id = parseInt(req.params.id)
  const match = await matchesModel.fetchById(id)

  if (!match) {
    return res.sendStatus(404)
  }

  await matchesModel.delete({ id })
  return res.sendStatus(204)
}

const deleteMatches = async (req, res) => {
  const { ids } = req.body
  // const match = await matchesModel.fetchById(id)

  // if (!match) {
  //   return res.sendStatus(404)
  // }

  await matchesModel.batchDelete({ values: ids })
  // await guessesModel.batchDelete({ columnName: 'matchId', values: ids }, false)
  return res.sendStatus(204)
}

export {
  getMatches,
  getMatch,
  createMatch,
  createMatches,
  updateMatch,
  deleteMatch,
  deleteMatches
}

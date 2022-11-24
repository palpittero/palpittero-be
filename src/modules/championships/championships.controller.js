import championshipsModel from '../../models/championships.model'
import teamsChampionshipsModel from '../../models/teamsChampionships.model'
import roundsModel from '../../models/rounds.model'
import teamsModel from '../../models/teams.model'
import matchesModel from '../../models/matches.model'
import groupsModel from '../../models/groups.model'
import {
  appendTeamsChampionships,
  appendChampionshipRounds,
  appendChampionshipGroups
} from '../teamsChampionships/teamsChampionships.helpers'
import minBy from 'lodash/fp/minBy'
import maxBy from 'lodash/fp/maxBy'
import difference from 'lodash/fp/difference'
import orderBy from 'lodash/fp/orderBy'
import { CHAMPIONSHIPS_ROUNDS } from './championships.constants'
import { parseChampionshipPositions } from './championships.helpers'
import championshipsTeamsPositionsModel from '../../models/championshipsTeamsPositions.model'

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
  const { name, year, teams, rounds, roundsType, groups, hasGroups } = req.body

  const [id] = await championshipsModel.insert({
    name,
    year
  })

  const championshipRounds = appendChampionshipRounds({
    championshipId: id,
    rounds,
    roundsType
  })

  await roundsModel.batchInsert(championshipRounds)

  if (hasGroups) {
    const championshipGroups = appendChampionshipGroups({
      championshipId: id,
      groups
    })

    let teamsChampionships = []

    await Promise.all(
      championshipGroups.map(async ({ teams, ...group }) => {
        const [groupId] = await groupsModel.insert(group)

        const groupTeams = teams.map((team) => ({
          ...team,
          groupId
        }))

        teamsChampionships = [
          ...teamsChampionships,
          ...appendTeamsChampionships({
            championshipId: id,
            teams: groupTeams
          })
        ]
      })
    )

    if (teamsChampionships.length > 0) {
      await teamsChampionshipsModel.replace(teamsChampionships)
    }
  } else {
    const teamsChampionships = appendTeamsChampionships({
      championshipId: id,
      teams
    })

    await teamsChampionshipsModel.replace(teamsChampionships)
  }

  return res.status(201).json({ data: id })
}

const updateChampionship = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, year, teams, rounds, positions, groups, hasGroups, status } =
    req.body

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

  const currentRounds = await roundsModel.fetchByChampionship({
    championshipId: id
  })

  const existingRoundsIds = currentRounds.map(({ id }) => id)
  const roundsToUpdate = rounds.filter(({ id }) => id)
  const roundsIdsToUpdate = roundsToUpdate.map(({ id }) => id)
  const roundsIdsToRemove = difference(existingRoundsIds, roundsIdsToUpdate)
  const roundsToInsert = rounds.filter(({ id }) => !id)

  if (roundsIdsToRemove.length > 0) {
    await roundsModel.batchDelete({
      columnName: 'id',
      values: roundsIdsToRemove
    })
  }

  if (roundsToInsert.length > 0) {
    const newChampionshipRounds = appendChampionshipRounds({
      championshipId: id,
      rounds: roundsToInsert,
      roundsType: CHAMPIONSHIPS_ROUNDS.DETAILED
    })

    await roundsModel.batchInsert(newChampionshipRounds)
  }

  if (roundsToUpdate.length > 0) {
    const updatedChampionshipRounds = appendChampionshipRounds({
      championshipId: id,
      rounds: roundsToUpdate,
      roundsType: CHAMPIONSHIPS_ROUNDS.DETAILED
    })

    updatedChampionshipRounds.map(
      async (round) => await roundsModel.update(round)
    )
  }

  if (hasGroups) {
    const currentGroups = await groupsModel.fetchByChampionship({
      championshipId: id
    })

    const existingGroupsIds = currentGroups.map(({ id }) => id)
    const groupsToUpdate = groups.filter(({ id }) => id)
    const groupsIdsToUpdate = groupsToUpdate.map(({ id }) => id)
    const groupsIdsToRemove = difference(existingGroupsIds, groupsIdsToUpdate)
    const groupsToInsert = groups.filter(({ id }) => !id)

    if (groupsIdsToRemove.length > 0) {
      await groupsModel.batchDelete({
        columnName: 'id',
        values: groupsIdsToRemove
      })

      await teamsChampionshipsModel.unlinkTeamGroups(groupsIdsToRemove)
    }

    if (groupsToInsert.length > 0) {
      const newChampionshipGroups = appendChampionshipGroups({
        championshipId: id,
        groups: groupsToInsert
      })

      let teamsChampionshipsToInsert = []

      await Promise.all(
        newChampionshipGroups.map(async ({ teams, ...group }) => {
          const [groupId] = await groupsModel.insert(group)

          const groupTeams = teams.map((team) => ({
            ...team,
            groupId
          }))

          teamsChampionshipsToInsert = [
            ...teamsChampionshipsToInsert,
            ...appendTeamsChampionships({
              championshipId: id,
              teams: groupTeams
            })
          ]
        })
      )

      if (teamsChampionshipsToInsert.length > 0) {
        await teamsChampionshipsModel.replace(teamsChampionshipsToInsert)
      }
    }

    if (groupsToUpdate.length > 0) {
      const updatedChampionshipGroups = appendChampionshipGroups({
        championshipId: id,
        groups: groupsToUpdate
      })

      let teamsChampionships = []

      updatedChampionshipGroups.map(async ({ teams, ...group }) => {
        if (teams.length === 0) {
          await groupsModel.delete({ id: group.id })
        } else {
          await groupsModel.update(group)

          const groupTeams = teams.map((team) => ({
            ...team,
            groupId: group.id
          }))

          teamsChampionships = [
            ...teamsChampionships,
            ...appendTeamsChampionships({
              championshipId: id,
              teams: groupTeams
            })
          ]
        }
      })

      if (teamsChampionships.length > 0) {
        await teamsChampionshipsModel.replace(teamsChampionships)
      }
    }
  } else {
    await groupsModel.batchDelete({
      columnName: 'championshipId',
      values: [id]
    })

    const teamsChampionships = appendTeamsChampionships({
      championshipId: id,
      teams,
      groups
    })

    await teamsChampionshipsModel.replace(teamsChampionships)
  }

  await championshipsTeamsPositionsModel.delete({ championshipId: id })
  const championshipPositions = parseChampionshipPositions({
    positions,
    championshipId: id
  })

  if (championshipPositions.length > 0) {
    await championshipsTeamsPositionsModel.replace(championshipPositions)
  }

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

  const currentRoundId =
    minBy(
      'roundId',
      championshipMatches.filter((match) => match.status === 'scheduled')
    )?.roundId || firstRoundId

  return res.json({
    data: orderBy(
      'code',
      'asc',
      championshipRounds.map((round) => ({
        ...round,
        first: round.id === firstRoundId,
        last: round.id === lastRoundId,
        current: round.id === currentRoundId
      }))
    )
  })
}

const getChampionshipGroups = async (req, res) => {
  const { id } = req.params

  const championship = await championshipsModel.fetchById(id)

  if (!championship) {
    return res.sendStatus(404)
  }

  const championshipGroups = await groupsModel.fetchByChampionship({
    championshipId: id
  })

  return res.json({
    data: orderBy('code', 'asc', championshipGroups)
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
  getChampionshipGroups,
  getChampionshipTeams
}

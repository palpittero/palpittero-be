import knex from '../database'
import baseModel from './base.model'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import values from 'lodash/fp/values'
import uniqBy from 'lodash/fp/uniqBy'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'championships'

const columns = ['id', 'name', 'year', 'status']

const fetchAll = async () => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'teams.id AS teamId',
      'teams.name AS teamName',
      'teams.badge AS teamBadge',
      'teamsChampionships.championshipId',
      'rounds.id AS roundId',
      'rounds.code AS roundCode',
      'rounds.name AS roundName',
      'rounds.type AS roundType'
    ])
    .leftJoin(
      'teamsChampionships',
      'teamsChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .leftJoin('teams', 'teams.id', `teamsChampionships.teamId`)
    .leftJoin('rounds', 'rounds.championshipId', `${TABLE_NAME}.id`)
    .where({
      [`${TABLE_NAME}.status`]: STATUS.ACTIVE
    })

  return appendEntities(rows)
}

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'teams.id AS teamId',
      'teams.name AS teamName',
      'teams.badge AS teamBadge'
    ])
    .leftJoin(
      'teamsChampionships',
      'teamsChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .leftJoin('teams', 'teams.id', `teamsChampionships.teamId`)
    .where(
      appendWhere({
        [`${TABLE_NAME}.id`]: id,
        [`${TABLE_NAME}.status`]: STATUS.ACTIVE
      })
    )

  return appendEntities(rows)[0]
}

const fetchByLeague = async ({ leagueId }) => {
  const rows = await knex(TABLE_NAME)
    .select([`${TABLE_NAME}.*`])
    .join(
      'leaguesChampionships',
      'leaguesChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .where(
      appendWhere({
        leagueId,
        [`${TABLE_NAME}.status`]: STATUS.ACTIVE
      })
    )
    .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

const appendEntities = (rows) =>
  pipe(
    reduce((result, row) => {
      const TEAMS_FIELDS = ['teamId', 'teamName', 'teamBadge', 'championshipId']
      const ROUNDS_FIELDS = ['roundId', 'roundCode', 'roundName', 'roundType']

      const team = {
        id: row.teamId,
        name: row.teamName,
        badge: row.teamBadge
      }

      const round = {
        id: row.roundId,
        code: row.roundCode,
        name: row.roundName,
        type: row.roundType
      }

      const teams = row.championshipId
        ? [...(result[row.id]?.teams || []), team]
        : result[row.id]?.teams || []

      const rounds = row.roundType
        ? [...(result[row.id]?.rounds || []), round]
        : result[row.id]?.rounds || []

      return {
        ...result,
        [row.id]: {
          ...omit([...TEAMS_FIELDS, ...ROUNDS_FIELDS], row),
          teams: uniqBy('id', teams),
          rounds: uniqBy('id', rounds)
        }
      }
    }, {}),
    values
  )(rows)

const appendWhere = ({ leagueId, ...where }) =>
  omitBy(isNil, {
    'leaguesChampionships.leagueId': leagueId,
    ...where
  })

const championshipsModel = baseModel(TABLE_NAME, columns)

export default {
  ...championshipsModel,
  fetchAll,
  fetchById,
  fetchByLeague
}

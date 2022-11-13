import knex from '../config/database'
import baseModel from './base.model'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import omit from 'lodash/fp/omit'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import values from 'lodash/fp/values'

const TABLE_NAME = 'groups'

const fetchByChampionship = async ({ championshipId }) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'teams.id AS teamId',
      'teams.name AS teamName',
      'teams.badge AS teamBadge'
    ])
    .leftJoin(
      'teamsChampionships',
      'teamsChampionships.groupId',
      `${TABLE_NAME}.id`
    )
    .leftJoin('teams', 'teams.id', 'teamsChampionships.teamId')
    .where(appendWhere({ championshipId }))

  return appendEntities(rows)
}

const appendWhere = ({ championshipId }) =>
  omitBy(isNil, {
    [`${TABLE_NAME}.championshipId`]: championshipId
  })

const appendEntities = (rows) => {
  return pipe(
    reduce((result, row) => {
      const TEAM_FIELDS = ['teamId', 'teamName', 'teamBadge']

      const team = {
        id: row.teamId,
        name: row.teamName,
        badge: row.teamBadge
      }

      const teams = row.teamId
        ? [...(result[row.id]?.teams || []), team]
        : result[row.id]?.teams || []

      return {
        ...result,
        [row.id]: {
          ...omit(TEAM_FIELDS, row),
          teams
        }
      }
    }, {}),
    values
  )(rows)
}

const groupsModel = baseModel(TABLE_NAME)

export default {
  ...groupsModel,
  fetchByChampionship
}

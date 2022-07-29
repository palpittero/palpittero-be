import knex from '../database'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

const TABLE_NAME = 'teams'

const columns = ['id', 'name', 'badge', 'status', 'createdAt', 'updatedAt']

const fetchByChampionship = async (championshipId) => {
  const rows = await knex(TABLE_NAME)
    .select([`${TABLE_NAME}.*`])
    .join('teamsChampionships', 'teamsChampionships.teamId', `${TABLE_NAME}.id`)
    .where(appendWhere({ championshipId }))
    .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

const appendEntities = (rows) => {
  const USERS_LEAGUES_FIELDS = [
    'usersLeaguesStatus',
    'usersLeaguesOwner',
    'usersLeaguesPoints'
  ]

  return rows.map((row) => ({
    ...omit(USERS_LEAGUES_FIELDS, row),
    status: row.usersLeaguesStatus,
    owner: row.usersLeaguesOwner,
    points: row.usersLeaguesPoints
  }))
}

const appendWhere = ({ leagueId, status }) =>
  omitBy(isNil, {
    'usersLeagues.leagueId': leagueId,
    'usersLeagues.status': status
  })

const teamsModel = baseModel(TABLE_NAME, columns)

export default {
  ...teamsModel,
  fetchByChampionship
}

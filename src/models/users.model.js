import knex from '../database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'users'

const columns = [
  'id',
  'name',
  'email',
  'password',
  'phone',
  'role',
  'status',
  'createdAt',
  'updatedAt'
]

const usersModel = baseModel(TABLE_NAME, columns)

const fetchByEmail = (email) =>
  knex(TABLE_NAME)
    .select('*')
    .where({ email })
    .where('status', '<>', STATUS.DELETED)
    .first()

const fetchByLeague = async ({ leagueId, status }) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      knex.raw('SUM(guesses.points) AS points'),
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.points AS usersLeaguesPoints'
    ])
    .join('usersLeagues', 'usersLeagues.userId', `${TABLE_NAME}.id`)
    .leftJoin('guesses', 'guesses.userId', `${TABLE_NAME}.id`)
    .where(appendWhere({ leagueId, status }))
    .groupBy(`${TABLE_NAME}.id`)
    .orderBy('points', 'desc')

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

export default {
  ...usersModel,
  fetchByEmail,
  fetchByLeague
}

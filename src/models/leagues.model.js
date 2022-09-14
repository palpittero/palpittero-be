import knex from '../database'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import pipe from 'lodash/fp/pipe'
import values from 'lodash/fp/values'
import reduce from 'lodash/fp/reduce'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'leagues'

const columns = [
  'id',
  'name',
  'badge',
  'private',
  'pointsStrategy',
  'status',
  'createdAt',
  'updatedAt'
]

const fetchAll = async ({ isPrivate, ownerId, ownersIds } = {}) => {
  const query = knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'usersLeagues.userId AS usersLeaguesUserId',
      'usersLeagues.points AS usersLeaguesPoints',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.leagueId AS usersLeaguesLeagueId',
      'users.name AS userName',
      'users.email AS userEmail'
    ])
    .leftJoin('usersLeagues', 'usersLeagues.leagueId', `${TABLE_NAME}.id`)
    .leftJoin('users', 'users.id', `usersLeagues.userId`)
    .where(
      appendWhere({
        isPrivate
      })
    )
    .where(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)

  if (ownerId) {
    query.whereRaw(
      `${appendOwnerIdSubQuery(knex.raw(`${TABLE_NAME}.id`))} = ${ownerId}`
    )
  }

  if (ownersIds) {
    query.whereRaw(
      `${appendOwnerIdSubQuery(
        knex.raw(`${TABLE_NAME}.id`)
      )} IN (${ownersIds.join(',')})`
    )
  }

  // query.groupBy(`${TABLE_NAME}.id`)

  return appendEntities(await query)
}

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'usersLeagues.userId AS usersLeaguesUserId',
      'usersLeagues.points AS usersLeaguesPoints',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.leagueId AS usersLeaguesLeagueId',
      'users.name AS userName'
    ])
    .leftJoin('usersLeagues', 'usersLeagues.leagueId', `${TABLE_NAME}.id`)
    .leftJoin('users', 'users.id', `usersLeagues.id`)
    .where({ [`${TABLE_NAME}.id`]: id })
    .where(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)

  return appendEntities(rows)[0]
}

const appendOwnerIdSubQuery = (leagueId) => {
  return knex.raw(
    `(${knex('usersLeagues')
      .select('userId')
      // .leftJoin(TABLE_NAME, 'leagueId', `${TABLE_NAME}.id`)
      .where({
        leagueId,
        owner: 1
      })
      .toString()})`
  )
}

const appendEntities = (rows) =>
  pipe(
    reduce((result, row) => {
      const JOIN_FIELDS = [
        'usersLeaguesUserId',
        'usersLeaguesPoints',
        'usersLeaguesOwner',
        'usersLeaguesStatus',
        'usersLeaguesLeagueId',
        'userName',
        'userEmail',
        'userId'
      ]

      const user = {
        points: row.usersLeaguesPoints,
        owner: row.usersLeaguesOwner,
        status: row.usersLeaguesStatus,
        leagueId: row.usersLeaguesLeagueId,
        id: row.usersLeaguesUserId,
        name: row.userName,
        email: row.userEmail
      }

      const users = row.usersLeaguesLeagueId
        ? [...(result[row.id]?.users || []), user]
        : result[row.id]?.users || []

      return {
        ...result,
        [row.id]: {
          ...omit(JOIN_FIELDS, row),
          users
        }
      }
    }, {}),
    values
  )(rows)

const appendWhere = ({ isPrivate }) =>
  omitBy(isNil, {
    [`${TABLE_NAME}.private`]: isPrivate
  })

const leaguesModel = baseModel(TABLE_NAME, columns)

export default {
  ...leaguesModel,
  fetchAll,
  fetchById
}

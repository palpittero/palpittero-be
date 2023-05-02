import knex from '../config/database'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import pipe from 'lodash/fp/pipe'
import values from 'lodash/fp/values'
import reduce from 'lodash/fp/reduce'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import uniqBy from 'lodash/fp/uniqBy'
import { STATUS } from '../shared/constants'
// import { uniqBy } from 'lodash'

const TABLE_NAME = 'leagues'

const columns = [
  'id',
  'name',
  'badge',
  'private',
  'pointsStrategy',
  'enablePrizes',
  'ticketValue',
  'status',
  'createdAt',
  'updatedAt'
]

const fetchAll = async ({
  isPrivate,
  userId,
  ownerId,
  ownersIds,
  usersLeaguesStatus,
  status
} = {}) => {
  const query = knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'usersLeagues.id AS usersLeaguesId',
      'usersLeagues.userId AS usersLeaguesUserId',
      'usersLeagues.points AS usersLeaguesPoints',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.leagueId AS usersLeaguesLeagueId',
      'users.name AS userName',
      'users.email AS userEmail',
      'leaguesPrizes.position AS leaguesPrizesPosition',
      'leaguesPrizes.amount AS leaguesPrizesAmount',
      'leaguesPrizes.id AS leaguesPrizesId'
      // knex.raw('COUNT(users.name) AS totalUsers')
    ])
    .leftJoin('usersLeagues', 'usersLeagues.leagueId', `${TABLE_NAME}.id`)
    .leftJoin('users', 'users.id', `usersLeagues.userId`)
    .leftJoin('leaguesPrizes', 'leaguesPrizes.leagueId', `${TABLE_NAME}.id`)
    .where(
      appendWhere({
        isPrivate,
        status,
        usersLeaguesStatus,
        userId
      })
    )
    .andWhere(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)
    .groupBy(['usersLeaguesId', `leaguesPrizesId`])

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

  return appendEntities(await query)
}

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'usersLeagues.id AS usersLeaguesId',
      'usersLeagues.userId AS usersLeaguesUserId',
      'usersLeagues.points AS usersLeaguesPoints',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.leagueId AS usersLeaguesLeagueId',
      'users.name AS userName',
      'users.email AS userEmail',
      'leaguesPrizes.position AS leaguesPrizesPosition',
      'leaguesPrizes.amount AS leaguesPrizesAmount',
      'leaguesPrizes.id AS leaguesPrizesId'
    ])
    .leftJoin('usersLeagues', 'usersLeagues.leagueId', `${TABLE_NAME}.id`)
    .leftJoin('users', 'users.id', `usersLeagues.userId`)
    .leftJoin('leaguesPrizes', 'leaguesPrizes.leagueId', `${TABLE_NAME}.id`)
    .where({ [`${TABLE_NAME}.id`]: id })
    .where(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)
    .groupBy(['usersLeaguesId', `leaguesPrizesId`])

  return appendEntities(rows)[0]
}

const fetchByIds = async (ids) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'usersLeagues.id AS usersLeaguesId',
      'usersLeagues.userId AS usersLeaguesUserId',
      'usersLeagues.points AS usersLeaguesPoints',
      'usersLeagues.owner AS usersLeaguesOwner',
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.leagueId AS usersLeaguesLeagueId',
      'users.name AS userName',
      'users.email AS userEmail',
      'leaguesPrizes.position AS leaguesPrizesPosition',
      'leaguesPrizes.amount AS leaguesPrizesAmount',
      'leaguesPrizes.id AS leaguesPrizesId'
    ])
    .leftJoin('usersLeagues', 'usersLeagues.leagueId', `${TABLE_NAME}.id`)
    .leftJoin('users', 'users.id', `usersLeagues.userId`)
    .leftJoin('leaguesPrizes', 'leaguesPrizes.leagueId', `${TABLE_NAME}.id`)
    .whereIn(`${TABLE_NAME}.id`, ids)
    .where(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)

  return appendEntities(rows)
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
        'usersLeaguesId',
        'usersLeaguesUserId',
        'usersLeaguesPoints',
        'usersLeaguesOwner',
        'usersLeaguesStatus',
        'usersLeaguesLeagueId',
        'userName',
        'userEmail',
        'userId',
        'leaguesPrizesId',
        'leaguesPrizesPosition',
        'leaguesPrizesAmount'
      ]

      const user = {
        usersLeaguesId: row.usersLeaguesId,
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

      const prize = {
        position: row.leaguesPrizesPosition,
        amount: row.leaguesPrizesAmount
      }

      const prizes = row.leaguesPrizesId
        ? [...(result[row.id]?.prizes || []), prize]
        : result[row.id]?.prizes || []

      return {
        ...result,
        [row.id]: {
          ...omit(JOIN_FIELDS, row),
          users: uniqBy('id', users),
          prizes: uniqBy('position', prizes)
        }
      }
    }, {}),
    values
  )(rows)

const appendWhere = ({ isPrivate, userId, status, usersLeaguesStatus }) =>
  omitBy(isNil, {
    [`${TABLE_NAME}.private`]: isPrivate,
    [`${TABLE_NAME}.status`]: status,
    'usersLeagues.userId': userId,
    'usersLeagues.status': usersLeaguesStatus
  })

const leaguesModel = baseModel(TABLE_NAME, columns)

export default {
  ...leaguesModel,
  fetchAll,
  fetchById,
  fetchByIds
}

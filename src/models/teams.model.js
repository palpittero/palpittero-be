import knex from '../config/database'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'teams'

const columns = ['id', 'name', 'badge', 'status', 'createdAt', 'updatedAt']

const fetchAll = async ({ countryId, type }) => {
  const query = knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'countries.id AS countryId',
      'countries.name AS countryName',
      'countries.flag AS countryFlag'
    ])
    .leftJoin('countries', 'countries.id', `${TABLE_NAME}.countryId`)
    .where(
      appendWhere({
        countryId,
        type
      })
    )
    .where(`${TABLE_NAME}.status`, '<>', STATUS.DELETED)

  return appendEntities(await query)
}

const fetchByChampionship = async (championshipId) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'countries.id AS countryId',
      'countries.name AS countryName',
      'countries.flag AS countryFlag',
      'teamsChampionships.groupId'
    ])
    .leftJoin('countries', 'countries.id', `${TABLE_NAME}.countryId`)
    .join('teamsChampionships', 'teamsChampionships.teamId', `${TABLE_NAME}.id`)
    .where(appendWhere({ championshipId, status: STATUS.ACTIVE }))
    .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

const fetchByChampionships = async (championshipsIds) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'countries.id AS countryId',
      'countries.name AS countryName',
      'countries.flag AS countryFlag',
      'teamsChampionships.groupId'
    ])
    .leftJoin('countries', 'countries.id', `${TABLE_NAME}.countryId`)
    .join('teamsChampionships', 'teamsChampionships.teamId', `${TABLE_NAME}.id`)
    .where(appendWhere({ status: STATUS.ACTIVE }))
    .whereIn('championshipId', championshipsIds)
    .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

// const fetchByGroupsIds = async ({ groupsIds }) => {
//   const rows = await knex(TABLE_NAME)
//     .select(['teams.*']).whereIn('groupId', groupsIds)

//   return rows
// }

const appendEntities = (rows) => {
  const COUNTRIES_FIELDS = ['countryId', 'countryName', 'countryFlag']

  return rows.map((row) => {
    const country = row.countryId
      ? {
          id: row.countryId,
          name: row.countryName,
          flag: row.countryFlag
        }
      : null

    return {
      ...omit(COUNTRIES_FIELDS, row),
      country
    }
  })
}

const appendWhere = ({ championshipId, status }) =>
  omitBy(isNil, {
    'teamsChampionships.championshipId': championshipId,
    [`${TABLE_NAME}.status`]: status
  })

const teamsModel = baseModel(TABLE_NAME, columns)

export default {
  ...teamsModel,
  fetchAll,
  fetchByChampionship,
  fetchByChampionships
}
//

import knex from '../config/database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

import baseModel from './base.model'

const TABLE_NAME = 'usersLeagues'

const usersLeaguesModel = baseModel(TABLE_NAME)

const fetchByUser = async ({ id, status }) => {
  return await knex(TABLE_NAME)
    .from(TABLE_NAME)
    .select(['leagues.*', 'usersLeagues.status AS status'])
    .join('leagues', 'leagues.id', 'usersLeagues.leagueId')
    .where(omitBy(isNil, { userId: id, [`${TABLE_NAME}.status`]: status }))
}

const fetchByLeague = async ({ id, status }) => {
  return await knex(TABLE_NAME)
    .from(TABLE_NAME)
    .select(['usersLeagues.*'])
    .join('leagues', 'leagues.id', 'usersLeagues.leagueId')
    .where(omitBy(isNil, { leagueId: id, [`${TABLE_NAME}.status`]: status }))
}

const deleteByLeague = async (leagueId) =>
  await knex(TABLE_NAME).del().where({ leagueId })

const unlinkLeagues = async (ownersIds) =>
  await knex(TABLE_NAME)
    .update({ userId: 1 })
    .whereIn('userId', ownersIds)
    .andWhere({ owner: 1 })

export default {
  ...usersLeaguesModel,
  fetchByUser,
  fetchByLeague,
  deleteByLeague,
  unlinkLeagues
}

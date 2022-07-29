import knex from '../database'
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
    .select(['leagues.*', 'usersLeagues.status AS status'])
    .join('leagues', 'leagues.id', 'usersLeagues.leagueId')
    .where(omitBy(isNil, { leagueId: id, [`${TABLE_NAME}.status`]: status }))
}

export default {
  ...usersLeaguesModel,
  fetchByUser,
  fetchByLeague
}

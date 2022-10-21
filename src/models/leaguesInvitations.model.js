import knex from '../config/database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import forEach from 'lodash/fp/forEach'
import isArray from 'lodash/fp/isArray'

import baseModel from './base.model'

const TABLE_NAME = 'leaguesInvitations'
const TABLE_COLUMNS = [
  'id',
  'email',
  'leagueId',
  'status',
  'createdAt',
  'updatedAt'
]

const leaguesInvitationsModel = baseModel(TABLE_NAME)

const fetchAll = async ({ leagueId, email, status } = {}) => {
  const query = knex(TABLE_NAME).select('*')
  const where = appendWhere({
    leagueId,
    status,
    email
  })

  forEach.convert({ cap: false })((value, column) => {
    if (TABLE_COLUMNS.includes(column)) {
      if (isArray(value)) {
        query.whereIn(column, value)
      } else {
        query.whereLike(column, value)
      }
    }
  }, where)

  return query
}

const batchDeleteByLeagueAndEmails = async ({ leagueId, emails }) =>
  await knex(TABLE_NAME).del().where({ leagueId }).whereIn('email', emails)

const appendWhere = ({ leagueId, status }) =>
  omitBy(isNil, {
    leagueId,
    status
  })

export default {
  ...leaguesInvitationsModel,
  fetchAll,
  batchDeleteByLeagueAndEmails
}

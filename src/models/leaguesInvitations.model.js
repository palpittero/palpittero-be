import knex from '../config/database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

import baseModel from './base.model'

const TABLE_NAME = 'leaguesInvitations'

const leaguesInvitationsModel = baseModel(TABLE_NAME)

const fetchAll = async ({ leagueId, email, status } = {}) => {
  const rows = await knex(TABLE_NAME).select().where(
    appendWhere({
      leagueId,
      status,
      email
    })
  )

  return rows
}

const deleteByLeague = async (leagueId) =>
  await knex(TABLE_NAME).del().where({ leagueId })

const appendWhere = ({ leagueId, status }) =>
  omitBy(isNil, {
    leagueId,
    status
  })

export default {
  ...leaguesInvitationsModel,
  fetchAll,
  deleteByLeague
}

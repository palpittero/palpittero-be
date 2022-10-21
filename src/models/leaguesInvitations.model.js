import knex from '../config/database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

import baseModel from './base.model'

const TABLE_NAME = 'leaguesInvitations'

const leaguesInvitationsModel = baseModel(TABLE_NAME)

const fetchAll = async ({ leagueId, email, status } = {}) =>
  await knex(TABLE_NAME).select('*').where(
    appendWhere({
      leagueId,
      status,
      email
    })
  )

const batchDeleteByLeagueAndEmails = async ({ leagueId, emails }) =>
  await knex(TABLE_NAME).del().where({ leagueId }).whereIn('email', emails)

const appendWhere = ({ leagueId, email, status }) =>
  omitBy(isNil, {
    email,
    leagueId,
    status
  })

export default {
  ...leaguesInvitationsModel,
  fetchAll,
  batchDeleteByLeagueAndEmails
}

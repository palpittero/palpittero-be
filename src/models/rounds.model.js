import knex from '../database'
import baseModel from './base.model'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

const TABLE_NAME = 'rounds'

const fetchByChampionship = async ({ championshipId }) =>
  await knex(TABLE_NAME)
    .select([`${TABLE_NAME}.*`])
    .where(appendWhere({ championshipId }))
    .groupBy(`${TABLE_NAME}.id`)

const appendWhere = ({ championshipId }) =>
  omitBy(isNil, {
    championshipId
  })

const roundsModel = baseModel(TABLE_NAME)

export default {
  ...roundsModel,
  fetchByChampionship
}

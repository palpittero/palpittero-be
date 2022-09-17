import knex from '../config/database'
import baseModel from './base.model'

const TABLE_NAME = 'countries'
const columns = ['id', 'name']

const fetchAll = () => knex(TABLE_NAME).select('*').orderBy('name')

const countriesModel = baseModel(TABLE_NAME, columns)

export default {
  ...countriesModel,
  fetchAll
}

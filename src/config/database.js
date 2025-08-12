import knex from 'knex'
import knexfile from '../../knexfile'

const { NODE_ENV } = process.env

const database = knex(knexfile[NODE_ENV])

if (NODE_ENV === 'memory') {
  await database.raw('PRAGMA foreign_keys = ON')
} else {
  await database.raw(`SET SESSION time_zone = '-3:00';`)
  await database.raw(`SET SESSION time_zone = '-3:00';`)
  await database.raw(
    `SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
  )
  await database.raw(
    `SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
  )
}

export default database

export const DB_DEFAULT_DATE_FN =
  process.env.NODE_ENV === 'development' ? 'NOW()' : 'UTC_TIMESTAMP()'

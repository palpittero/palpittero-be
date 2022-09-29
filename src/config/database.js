import knex from 'knex'
import knexfile from '../../knexfile'

const { NODE_ENV } = process.env

console.log({ NODE_ENV })
const database = knex(knexfile[NODE_ENV])

if (NODE_ENV === 'memory') {
  await database.raw('PRAGMA foreign_keys = ON')
} else {
  // await database.raw(`SET time_zone='America/Sao_Paulo';`)
  await database.raw(`SET GLOBAL time_zone = '-3:00';`)
}

export default database

export const DB_DEFAULT_DATE_FN =
  process.env.NODE_ENV === 'development' ? 'NOW()' : 'UTC_TIMESTAMP()'

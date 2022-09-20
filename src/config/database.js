import knex from 'knex'
import knexfile from '../../knexfile'

const { NODE_ENV } = process.env

const database = knex(knexfile[NODE_ENV])

if (NODE_ENV === 'memory') {
  await database.raw('PRAGMA foreign_keys = ON')
} else {
  await database.raw(`SET time_zone='America/Sao_Paulo';`)
}

export default database
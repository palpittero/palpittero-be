import dotenv from 'dotenv'
dotenv.config()

export default {
  development: {
    client: 'sqlite3',
    debug: true,
    connection: {
      filename: process.env.DB_SQLITE3_FILENAME
    },
    seeds: {
      directory: './data/seeds'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

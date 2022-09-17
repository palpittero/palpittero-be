import knex from '../config/database'

const fetchGeneralStats = async () =>
  await knex
    .select([
      knex.raw(`(SELECT COUNT(id) FROM users) AS users`),
      knex.raw(`(SELECT COUNT(id) FROM leagues) AS leagues`),
      knex.raw(
        `(SELECT COUNT(id) FROM guesses WHERE points IS NOT NULL) AS processedGuesses`
      )
    ])
    .first()

const fetchUnprocessedGuesses = async () =>
  await knex('guesses')
    .count('id AS unprocessedGuesses')
    .where({ points: null })
    .first()

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses
}

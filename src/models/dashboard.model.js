import knex from '../config/database'
import { MATCH_STATUSES } from '../modules/matches/matches.constants'
import { MATCH_STATUS_QUERY } from './matches.model'

const TABLE_NAME = 'guesses'

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
  await knex
    .select('unprocessedGuesses')
    .from(
      knex(TABLE_NAME)
        .select([
          'points',
          knex.raw(`COUNT(${TABLE_NAME}.id) AS unprocessedGuesses`),
          knex.raw(MATCH_STATUS_QUERY.replace(' AS status', ' AS matchStatus'))
        ])
        .join('matches', 'matches.id', `${TABLE_NAME}.matchId`)
        .groupBy('matchStatus')
        .as('unprocessedGuesses')
    )
    .where({
      matchStatus: MATCH_STATUSES.FINISHED,
      points: null
    })
    .first()

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses
}

import knex from '../config/database'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import orderBy from 'lodash/fp/orderBy'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'users'

const columns = [
  'id',
  'name',
  'email',
  'password',
  'phone',
  'role',
  'avatar',
  'status',
  'createdAt',
  'updatedAt'
]

const usersModel = baseModel(TABLE_NAME, columns)

const fetchByEmail = (email) =>
  knex(TABLE_NAME)
    .select('*')
    .where({ email })
    .where('status', '<>', STATUS.DELETED)
    .first()

const fetchByLeague = async ({ leagueId, status }) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      // knex.raw(
      //   'COALESCE(SUM(championshipsGuesses.points), 0) AS championshipsGuessesPoints'
      // ),
      'usersLeagues.status AS usersLeaguesStatus',
      'usersLeagues.owner AS usersLeaguesOwner',
      knex.raw(
        '(SELECT(COALESCE(SUM(points), 0)) FROM guesses WHERE userId = users.id AND leagueId = usersLeagues.leagueId) AS guessesPoints'
      ),
      knex.raw(
        '(SELECT(COALESCE(SUM(points), 0)) FROM championshipsGuesses WHERE userId = users.id AND leagueId = usersLeagues.leagueId) AS championshipsGuessesPoints'
      )
    ])
    .join('usersLeagues', 'usersLeagues.userId', `${TABLE_NAME}.id`)
    .where(appendWhere({ leagueId, status }))
  return appendEntities(rows)
}

const appendEntities = (rows) => {
  const USERS_LEAGUES_FIELDS = ['usersLeaguesStatus', 'usersLeaguesOwner']

  return orderBy(
    'points',
    'desc',
    rows.map((row) => {
      const guessesPoints = parseInt(row.guessesPoints || 0)
      const championshipsGuessesPoints = parseInt(
        row.championshipsGuessesPoints || 0
      )

      const points = guessesPoints + championshipsGuessesPoints

      return {
        ...omit(USERS_LEAGUES_FIELDS, row),
        status: row.usersLeaguesStatus,
        owner: row.usersLeaguesOwner,
        points
      }
    })
  )
}

const appendWhere = ({ leagueId, status }) =>
  omitBy(isNil, {
    'usersLeagues.leagueId': leagueId,
    'usersLeagues.status': status
  })

export default {
  ...usersModel,
  fetchByEmail,
  fetchByLeague
}

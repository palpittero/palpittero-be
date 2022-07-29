import knex from '../database'
import baseModel from './base.model'
import pick from 'lodash/fp/pick'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'

const TABLE_NAME = 'guesses'

const guessesModel = baseModel(TABLE_NAME)

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'match.*',
      'user.name AS userName',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(match.date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+60 minutes') > matchdate, "preparation", "scheduled")) AS status`
      )
    ])
    .join('users AS user', 'user.id', `${TABLE_NAME}.userId`)
    .join('leagues AS league', 'league.id', `${TABLE_NAME}.leagueId`)
    .join('matches AS match', 'match.id', `${TABLE_NAME}.matchId`)
    .join('teams AS homeTeam', 'homeTeam.id', 'match.homeTeamId')
    .join('teams AS awayTeam', 'awayTeam.id', 'match.awayTeamId')
    .where({ [`${TABLE_NAME}.id`]: id })

  return appendEntities(rows)[0]
}

const fetchAll = async ({ userId, leagueId, matchId, roundId } = {}) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'match.*',
      'user.name AS userName',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'league.pointsStrategy AS leaguePointsStrategy',
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(match.date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+60 minutes') > match.date, "preparation", "scheduled")) AS status`
      )
    ])
    .join('users AS user', 'user.id', `${TABLE_NAME}.userId`)
    .join('leagues AS league', 'league.id', `${TABLE_NAME}.leagueId`)
    .join('matches AS match', 'match.id', `${TABLE_NAME}.matchId`)
    .join('teams AS homeTeam', 'homeTeam.id', 'match.homeTeamId')
    .join('teams AS awayTeam', 'awayTeam.id', 'match.awayTeamId')
    .where(
      appendWhere({
        userId,
        leagueId,
        matchId,
        roundId
      })
    )

  return appendEntities(rows)
}

const appendEntities = (rows) =>
  rows.reduce((result, row) => {
    const MATCH_FIELDS = [
      'roundId',
      'homeTeamId',
      'awayTeamId',
      'regularTimeHomeTeamGoals',
      'regularTimeAwayTeamGoals',
      'extraTimeHomeTeamGoals',
      'extraTimeAwayTeamGoals',
      'penaltiesTimeHomeTeamGoals',
      'penaltiesTimeAwayTeamGoals',
      'date',
      'result',
      'status'
    ]

    const JOIN_FIELDS = [
      'userName',
      'leagueName',
      'leagueBadge',
      'leaguePointsStrategy',
      'homeTeamName',
      'awayTeamName',
      'homeTeamBadge',
      'awayTeamBadge'
    ]

    return [
      ...result,
      {
        ...omit([...MATCH_FIELDS, ...JOIN_FIELDS], row),
        status: row.guessStatus,
        user: {
          id: row.userId,
          name: row.userName
        },
        league: {
          id: row.leagueId,
          name: row.leagueName,
          badge: row.leagueBadge,
          pointsStrategy: row.leaguePointsStrategy
        },
        match: {
          id: row.matchId,
          ...pick(MATCH_FIELDS, row),
          homeTeam: {
            id: row.homeTeamId,
            name: row.homeTeamName,
            badge: row.homeTeamBadge
          },
          awayTeam: {
            id: row.awayTeamId,
            name: row.awayTeamName,
            badge: row.awayTeamBadge
          }
        }
      }
    ]
  }, [])

const appendWhere = ({ userId, leagueId, matchId, roundId }) =>
  omitBy(isNil, {
    userId,
    leagueId,
    matchId,
    'match.roundId': roundId
  })

export default {
  ...guessesModel,
  fetchById,
  fetchAll
}

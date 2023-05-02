import knex from '../config/database'
import baseModel from './base.model'
import pick from 'lodash/fp/pick'
import omit from 'lodash/fp/omit'
import pickBy from 'lodash/fp/pickBy'
import identity from 'lodash/fp/identity'
import { MATCH_STATUS_QUERY } from './matches.model'
import { MATCH_STATUSES } from '../modules/matches/matches.constants'
import { STATUS } from '../shared/constants'
// import { DB_DEFAULT_DATE_FN } from '../config/database'

const TABLE_NAME = 'guesses'

export const TABLE_FIELDS = [
  'userId',
  'leagueId',
  'matchId',
  'homeTeamRegularTimeGoals',
  'awayTeamRegularTimeGoals',
  'homeTeamExtraTimeGoals',
  'awayTeamExtraTimeGoals',
  'homeTeamPenaltiesTimeGoals',
  'awayTeamPenaltiesTimeGoals',
  'points',
  'createdAt',
  'updatedAt'
]

// const MATCH_STATUS_QUERY = `
//   IF(
//     ${DB_DEFAULT_DATE_FN} > DATE_ADD(date, INTERVAL 240 MINUTE),
//     "finished",
//     IF(
//       ${DB_DEFAULT_DATE_FN} < date AND DATE_ADD(${DB_DEFAULT_DATE_FN}, INTERVAL 15 MINUTE) > date,
//       "preparation",
//       IF (
//         ${DB_DEFAULT_DATE_FN} < DATE_ADD(date, INTERVAL 240 MINUTE) AND ${DB_DEFAULT_DATE_FN} > date,
//         "in_progress",
//         "scheduled"
//       )
//     )
//   ) AS status
// `

const guessesModel = baseModel(TABLE_NAME)

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'match.roundId',
      'match.homeTeamId',
      'match.awayTeamId',
      'match.regularTimeHomeTeamGoals',
      'match.regularTimeAwayTeamGoals',
      'match.extraTimeHomeTeamGoals',
      'match.extraTimeAwayTeamGoals',
      'match.penaltiesTimeHomeTeamGoals',
      'match.penaltiesTimeAwayTeamGoals',
      'match.date',
      'match.result',
      // 'match.status',
      'user.name AS userName',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(match.date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+15 minutes') > matchdate, "preparation", "scheduled")) AS status`
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

const fetchAll = async ({
  userId,
  leagueId,
  championshipId,
  matchId,
  roundId
} = {}) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      // 'match.*',
      'matches.roundId',
      'matches.homeTeamId',
      'matches.awayTeamId',
      'matches.regularTimeHomeTeamGoals',
      'matches.regularTimeAwayTeamGoals',
      'matches.extraTimeHomeTeamGoals',
      'matches.extraTimeAwayTeamGoals',
      'matches.penaltiesTimeHomeTeamGoals',
      'matches.penaltiesTimeAwayTeamGoals',
      'matches.date',
      'matches.result',
      // 'match.status',
      'user.name AS userName',
      'user.email AS userEmail',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'league.status AS leagueStatus',
      'league.pointsStrategy AS leaguePointsStrategy',
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      'round.type AS roundType',
      'championship.name AS championshipName',
      'championship.status AS championshipStatus',
      knex.raw(MATCH_STATUS_QUERY)
    ])
    .join('users AS user', 'user.id', `${TABLE_NAME}.userId`)
    .join('leagues AS league', 'league.id', `${TABLE_NAME}.leagueId`)
    .join('matches', 'matches.id', `${TABLE_NAME}.matchId`)
    .join('teams AS homeTeam', 'homeTeam.id', 'matches.homeTeamId')
    .join('teams AS awayTeam', 'awayTeam.id', 'matches.awayTeamId')
    .join(
      'leaguesChampionships AS leagueChampionship',
      'leagueChampionship.leagueId',
      'league.id'
    )
    .join(
      'championships AS championship',
      'leagueChampionship.championshipId',
      'championship.id'
    )

    .join('rounds AS round', 'matches.roundId', 'round.id')
    .where(
      appendWhere({
        userId,
        leagueId,
        matchId,
        roundId,
        championshipId,
        championshipStatus: STATUS.ACTIVE,
        leagueStatus: STATUS.ACTIVE
      })
    )
    .groupBy(`${TABLE_NAME}.id`)

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
      'userEmail',
      'leagueName',
      'leagueBadge',
      'leaguePointsStrategy',
      'homeTeamName',
      'awayTeamName',
      'homeTeamBadge',
      'awayTeamBadge',
      'roundType',
      'championshipId',
      'championshipName'
    ]

    return [
      ...result,
      {
        ...omit([...MATCH_FIELDS, ...JOIN_FIELDS], row),
        status: row.guessStatus,
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail
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
          },
          round: {
            type: row.roundType,
            championship: {
              id: row.championshipId,
              name: row.championshipName
            }
          }
        }
      }
    ]
  }, [])

const appendWhere = ({
  userId,
  leagueId,
  championshipId,
  matchId,
  roundId,
  leagueStatus,
  championshipStatus
}) =>
  pickBy(identity, {
    userId,
    'guesses.leagueId': leagueId,
    matchId,
    'matches.roundId': roundId,
    'round.championshipId': championshipId,
    'league.status': leagueStatus,
    'championship.status': championshipStatus
  })

const fetchByUserLeagueChampionships = async ({
  userId,
  leagueId,
  championshipsIds
}) =>
  await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      knex.raw(MATCH_STATUS_QUERY.replace(' AS status', ' AS matchStatus'))
    ])
    .join('matches', 'matches.id', `${TABLE_NAME}.matchId`)
    .join(
      'leaguesChampionships',
      'leaguesChampionships.leagueId',
      `${TABLE_NAME}.leagueId`
    )
    .join('rounds', function () {
      this.on('rounds.id', '=', 'matches.roundId').andOn(
        'rounds.championshipId',
        '=',
        `leaguesChampionships.championshipId`
      )
    })

    .where({
      userId,
      [`${TABLE_NAME}.leagueId`]: leagueId
    })
    .whereIn(`leaguesChampionships.championshipId`, championshipsIds)
    .groupBy(`${TABLE_NAME}.id`)
    .having('matchStatus', '=', MATCH_STATUSES.SCHEDULED)

export default {
  ...guessesModel,
  fetchById,
  fetchAll,
  fetchByUserLeagueChampionships
}

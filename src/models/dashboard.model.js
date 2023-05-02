import knex from '../config/database'
import pick from 'lodash/fp/pick'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import values from 'lodash/fp/values'
import { MATCH_STATUSES } from '../modules/matches/matches.constants'
import { MATCH_STATUS_QUERY } from './matches.model'
import { STATUS } from '../shared/constants'
// import { pipe } from 'lodash/fp'

const MATCHES_GUESSES_TABLE_NAME = 'guesses'
const CHAMPIONSHIPS_GUESSES_TABLE_NAME = 'championshipsGuesses'

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

const fetchUnprocessedMatchesGuesses = async ({ leagueId } = {}) => {
  const rows = await knex
    .select('*')
    .from(
      knex(MATCHES_GUESSES_TABLE_NAME)
        .select([
          `${MATCHES_GUESSES_TABLE_NAME}.points`,
          `${MATCHES_GUESSES_TABLE_NAME}.homeTeamRegularTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.awayTeamRegularTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.homeTeamExtraTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.awayTeamExtraTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.homeTeamPenaltiesTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.awayTeamPenaltiesTimeGoals`,
          `${MATCHES_GUESSES_TABLE_NAME}.userId`,
          `${MATCHES_GUESSES_TABLE_NAME}.leagueId`,
          `${MATCHES_GUESSES_TABLE_NAME}.matchId`,

          'users.name AS userName',
          'users.avatar AS userAvatar',

          'leagues.name AS leagueName',
          'leagues.badge AS leagueBadge',
          'leagues.status AS leagueStatus',

          'homeTeam.name AS homeTeamName',
          'homeTeam.badge AS homeTeamBadge',

          'awayTeam.name AS awayTeamName',
          'awayTeam.badge AS awayTeamBadge',

          'matches.date',
          'matches.regularTimeHomeTeamGoals',
          'matches.regularTimeAwayTeamGoals',
          'matches.extraTimeHomeTeamGoals',
          'matches.extraTimeAwayTeamGoals',
          'matches.penaltiesTimeHomeTeamGoals',
          'matches.penaltiesTimeAwayTeamGoals',
          'matches.roundId',
          knex.raw(MATCH_STATUS_QUERY.replace(' AS status', ' AS matchStatus')),

          'rounds.name AS roundName',
          'rounds.type AS roundType',
          'rounds.championshipId',

          'championships.name AS championshipName',
          'championships.year AS championshipYear',
          'championships.status AS championshipStatus',

          'groups.id AS groupId',
          'groups.name AS groupName'
        ])
        .join('matches', 'matches.id', `${MATCHES_GUESSES_TABLE_NAME}.matchId`)
        .join('leagues', 'leagues.id', `${MATCHES_GUESSES_TABLE_NAME}.leagueId`)
        .join('users', 'users.id', `${MATCHES_GUESSES_TABLE_NAME}.userId`)

        .join('teams AS homeTeam', 'homeTeam.id', 'matches.homeTeamId')
        .join('teams AS awayTeam', 'awayTeam.id', 'matches.awayTeamId')

        .join('rounds', 'rounds.id', 'matches.roundId')
        .join('championships', 'championships.id', 'rounds.championshipId')

        .leftJoin('teamsChampionships', function () {
          this.on('teamsChampionships.teamId', '=', 'homeTeam.id').andOn(
            'teamsChampionships.championshipId',
            '=',
            'rounds.championshipId'
          )
        })
        .leftJoin('groups', 'groups.id', 'teamsChampionships.groupId')
        .as('unprocessedGuesses')
    )
    .where({
      matchStatus: MATCH_STATUSES.FINISHED,
      leagueStatus: STATUS.ACTIVE,
      championshipStatus: STATUS.ACTIVE,
      points: null,
      ...appendWhere({ leagueId })
    })

  return appendEntities(rows)
}

const fetchUnprocessedChampionshipsGuesses = async ({ leagueId } = {}) => {
  const rows = await knex
    .select('*')
    .from(
      knex(CHAMPIONSHIPS_GUESSES_TABLE_NAME)
        .select([
          `${CHAMPIONSHIPS_GUESSES_TABLE_NAME}.*`,
          'users.name AS userName',
          'users.email AS userEmail',
          'users.avatar AS userAvatar',

          'leagues.name AS leagueName',
          'leagues.badge AS leagueBadge',
          'leagues.status AS leagueStatus',

          'championship.name AS championshipName',
          'championship.year AS championshipYear',
          'championship.status AS championshipStatus',

          'championshipTeamPosition.position AS championshipTeamPositionPosition',

          'teamPosition.id AS teamPositionId',
          'teamPosition.name AS teamPositionName',
          'teamPosition.badge AS teamPositionBadge'
        ])

        .join('users', 'users.id', `${CHAMPIONSHIPS_GUESSES_TABLE_NAME}.userId`)
        .join(
          'leagues',
          'leagues.id',
          `${CHAMPIONSHIPS_GUESSES_TABLE_NAME}.leagueId`
        )

        .join(
          'championships AS championship',
          'championship.id',
          `${CHAMPIONSHIPS_GUESSES_TABLE_NAME}.championshipId`
        )

        .leftJoin(
          'championshipsTeamsPositions AS championshipTeamPosition',
          'championshipTeamPosition.championshipId',
          'championship.id'
        )

        .leftJoin(
          'teams AS teamPosition',
          'teamPosition.id',
          `${CHAMPIONSHIPS_GUESSES_TABLE_NAME}.teamId`
        )
        .as('unprocessedChampionshipGuesses')
    )
    .where({
      points: null,
      ...appendWhere({
        leagueId,
        leagueStatus: STATUS.ACTIVE,
        championshipStatus: STATUS.ACTIVE
      })
    })
    .whereRaw('championshipTeamPositionPosition IS NOT null')

  return appendChampionshipsGuessesEntities(rows)
}

const appendWhere = ({ leagueId, leagueStatus, championshipStatus }) =>
  omitBy(isNil, {
    leagueId,
    leagueStatus,
    championshipStatus
  })

const appendEntities = (rows) => {
  const MATCH_FIELDS = [
    'date',
    'regularTimeHomeTeamGoals',
    'regularTimeAwayTeamGoals',
    'extraTimeHomeTeamGoals',
    'extraTimeAwayTeamGoals',
    'penaltiesTimeHomeTeamGoals',
    'penaltiesTimeAwayTeamGoals'
  ]

  const OMIT_FIELDS = [
    'userName',
    'userAvatar',
    'leagueName',
    'leagueBadge',
    'homeTeamName',
    'homeTeamBadge',
    'awayTeamName',
    'awayTeamBadge',
    'matchStatus',
    'roundId',
    'roundName',
    'roundType',
    'championshipId',
    'championshipName',
    'championshipYear',
    'homeTeamId',
    'awayTeamId',
    'userId',
    'leagueId',
    'matchId',
    'groupId',
    ...MATCH_FIELDS
  ]

  return rows.map((row) => {
    const user = {
      id: row.userId,
      name: row.userName
    }

    const league = {
      id: row.leagueId,
      name: row.leagueName,
      badge: row.leagueBadge
    }

    const homeTeam = {
      id: row.homeTeamId,
      name: row.homeTeamName,
      badge: row.homeTeamBadge
    }

    const awayTeam = {
      id: row.awayTeamId,
      name: row.awayTeamName,
      badge: row.awayTeamBadge
    }

    const championship = {
      id: row.championshipId,
      name: row.championshipName,
      year: row.championshipYear
    }

    const round = {
      id: row.roundId,
      name: row.roundName,
      type: row.roundType,
      championship
    }

    const group = {
      id: row.groupId,
      name: row.groupName
    }

    const match = {
      id: row.matchId,
      ...pick(MATCH_FIELDS, row),
      homeTeam,
      awayTeam,
      round,
      status: row.matchStatus,
      group
    }

    return {
      ...omit(OMIT_FIELDS, row),
      user,
      league,
      match
    }
  })
}

const appendChampionshipsGuessesEntities = (rows) => {
  const OMIT_FIELDS = [
    'userName',
    'userEmail',
    'userAvatar',
    'leagueName',
    'leagueBadge',
    'championshipId',
    'championshipName',
    'championshipYear',

    'championshipTeamPositionPosition',

    'teamPositionId',
    'teamPositionName',
    'teamPositionBadge'
  ]

  return pipe(
    reduce((result, row) => {
      const user = {
        id: row.userId,
        name: row.userName
      }

      const league = {
        id: row.leagueId,
        name: row.leagueName,
        badge: row.leagueBadge
      }

      const position = {
        position: row.championshipTeamPositionPosition,
        team: {
          id: row.teamPositionId,
          name: row.teamPositionName,
          badge: row.teamPositionBadge
        }
      }

      const positions = row.championshipTeamPositionPosition
        ? [...(result[row.id]?.championship?.positions || []), position]
        : result[row.id]?.championship?.positions || []

      const team = {
        id: row.teamPositionId,
        name: row.teamPositionName,
        badge: row.teamPositionBadge
      }

      const championship = {
        id: row.championshipId,
        name: row.championshipName,
        year: row.championshipYear,
        positions
      }

      return {
        ...result,
        [row.id]: {
          ...omit(OMIT_FIELDS, row),
          user,
          league,
          championship,
          team
        }
      }
    }, {}),
    values
  )(rows)
}

export default {
  fetchGeneralStats,
  fetchUnprocessedMatchesGuesses,
  fetchUnprocessedChampionshipsGuesses
}

import pick from 'lodash/fp/pick'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
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

const fetchUnprocessedGuesses = async ({ leagueId } = {}) => {
  const rows = await knex
    .select('*')
    .from(
      knex(TABLE_NAME)
        .select([
          `${TABLE_NAME}.points`,
          `${TABLE_NAME}.homeTeamRegularTimeGoals`,
          `${TABLE_NAME}.awayTeamRegularTimeGoals`,
          `${TABLE_NAME}.homeTeamExtraTimeGoals`,
          `${TABLE_NAME}.awayTeamExtraTimeGoals`,
          `${TABLE_NAME}.homeTeamPenaltiesTimeGoals`,
          `${TABLE_NAME}.awayTeamPenaltiesTimeGoals`,
          `${TABLE_NAME}.userId`,
          `${TABLE_NAME}.leagueId`,
          `${TABLE_NAME}.matchId`,

          'users.name AS userName',
          'users.avatar AS userAvatar',

          'leagues.name AS leagueName',
          'leagues.badge AS leagueBadge',

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

          'groups.id AS groupId',
          'groups.name AS groupName'
        ])
        .join('matches', 'matches.id', `${TABLE_NAME}.matchId`)
        .join('leagues', 'leagues.id', `${TABLE_NAME}.leagueId`)
        .join('users', 'users.id', `${TABLE_NAME}.userId`)

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

        // .leftJoin('teamsChampionships', 'teamsChampionships.teamId', 'homeTeam.id')
        .leftJoin('groups', 'groups.id', 'teamsChampionships.groupId')

        .as('unprocessedGuesses')
    )
    .where({
      matchStatus: MATCH_STATUSES.FINISHED,
      points: null,
      ...appendWhere({ leagueId })
    })

  return appendEntities(rows)
}

const appendWhere = ({ leagueId }) =>
  omitBy(isNil, {
    leagueId: leagueId
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

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses
}

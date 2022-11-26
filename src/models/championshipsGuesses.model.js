import knex from '../config/database'
import baseModel from './base.model'
import omit from 'lodash/fp/omit'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import values from 'lodash/fp/values'
import pickBy from 'lodash/fp/pickBy'
import identity from 'lodash/fp/identity'
// import { pipe } from 'lodash/fp'

const TABLE_NAME = 'championshipsGuesses'

export const TABLE_FIELDS = [
  'userId',
  'leagueId',
  'championshipId',
  'teamId',
  'position',
  'points',
  'createdAt',
  'updatedAt'
]

const championshipsGuessesModel = baseModel(TABLE_NAME)

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'championship.name AS championshipName',
      'user.name AS userName',
      'user.email AS userEmail',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'team.name AS teamName',
      'team.badge AS teamBadge',
      'championshipTeamPosition.position AS championshipTeamPositionPosition',
      'championshipTeamPosition.teamId AS championshipTeamPositionTeamId',
      'championshipTeamPosition.points AS championshipTeamPositionPoints'
    ])
    .join(
      'championships AS championship',
      'championship.id',
      `${TABLE_NAME}.championshipId`
    )
    .leftJoin(
      'championshipsTeamsPositions AS championshipTeamPosition',
      'championshipTeamPosition.championshipId',
      `${TABLE_NAME}.championshipId`
    )
    .join('users AS user', 'user.id', `${TABLE_NAME}.userId`)
    .join('leagues AS league', 'league.id', `${TABLE_NAME}.leagueId`)
    .join('teams AS team', 'team.id', `${TABLE_NAME}.teamId`)
    .where({ [`${TABLE_NAME}.id`]: id })

  return appendEntities(rows)[0]
}

const fetchAll = async ({ userId, leagueId, championshipId } = {}) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'championship.name AS championshipName',
      'user.name AS userName',
      'user.email AS userEmail',
      'league.name AS leagueName',
      'league.badge AS leagueBadge',
      'team.name AS teamName',
      'team.badge AS teamBadge',
      'championshipTeamPosition.position AS championshipTeamPositionPosition',
      'championshipTeamPosition.teamId AS championshipTeamPositionTeamId',
      'championshipTeamPosition.points AS championshipTeamPositionPoints'
    ])
    .join(
      'championships AS championship',
      'championship.id',
      `${TABLE_NAME}.championshipId`
    )
    .leftJoin(
      'championshipsTeamsPositions AS championshipTeamPosition',
      'championshipTeamPosition.championshipId',
      `${TABLE_NAME}.championshipId`
    )
    .join('users AS user', 'user.id', `${TABLE_NAME}.userId`)
    .join('leagues AS league', 'league.id', `${TABLE_NAME}.leagueId`)
    .join('teams AS team', 'team.id', `${TABLE_NAME}.teamId`)
    .where(
      appendWhere({
        userId,
        leagueId,
        championshipId
      })
    )
  // .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

const fetchByUserLeagueChampionships = async ({
  userId,
  leagueId,
  championshipsIds
}) =>
  await knex(TABLE_NAME)
    // .select([
    // `${TABLE_NAME}.*`
    // knex.raw(MATCH_STATUS_QUERY.replace(' AS status', ' AS matchStatus'))
    // ])
    // .join('matches', 'matches.id', `${TABLE_NAME}.matchId`)
    // .join(
    //   'leaguesChampionships',
    //   'leaguesChampionships.leagueId',
    //   `${TABLE_NAME}.leagueId`
    // )
    // .join('rounds', function () {
    //   this.on('rounds.id', '=', 'matches.roundId').andOn(
    //     'rounds.championshipId',
    //     '=',
    //     `leaguesChampionships.championshipId`
    //   )
    // })
    .where({
      userId,
      [`${TABLE_NAME}.leagueId`]: leagueId
    })
    .whereIn(`${TABLE_NAME}.championshipId`, championshipsIds)
    .groupBy(`${TABLE_NAME}.id`)
// .having('matchStatus', '=', MATCH_STATUSES.SCHEDULED)

const appendEntities = (rows) =>
  pipe(
    reduce((result, row) => {
      {
        const JOIN_FIELDS = [
          'userName',
          'userEmail',
          'leagueName',
          'leagueBadge',
          'teamName',
          'teamBadge',
          'championshipName',
          'championshipTeamPositionPosition',
          'championshipTeamPositionPoints',
          'championshipTeamPositionTeamId'
        ]

        const position = {
          teamId: row.championshipTeamPositionTeamId,
          position: row.championshipTeamPositionPosition,
          points: row.championshipTeamPositionPoints
        }

        const positions = row.championshipTeamPositionTeamId
          ? [...(result[row.id]?.championship?.positions || []), position]
          : result[row.id]?.championship?.positions || []

        return {
          ...result,
          [row.id]: {
            ...omit(JOIN_FIELDS, row),
            user: {
              id: row.userId,
              name: row.userName,
              email: row.userEmail
            },
            league: {
              id: row.leagueId,
              name: row.leagueName,
              badge: row.leagueBadge
            },
            championship: {
              id: row.championshipId,
              name: row.championshipName,
              positions
            },
            team: {
              id: row.teamId,
              name: row.teamName,
              badge: row.teamBadge
            }
          }
        }
      }
    }, {}),
    values
  )(rows)

const appendWhere = ({ userId, leagueId, championshipId }) =>
  pickBy(identity, {
    userId,
    leagueId,
    [`${TABLE_NAME}.championshipId`]: championshipId
  })

export default {
  ...championshipsGuessesModel,
  fetchById,
  fetchAll,
  fetchByUserLeagueChampionships
}

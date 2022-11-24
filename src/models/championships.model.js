import knex from '../config/database'
import baseModel from './base.model'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import values from 'lodash/fp/values'
import uniqBy from 'lodash/fp/uniqBy'
import orderBy from 'lodash/fp/orderBy'
import { STATUS } from '../shared/constants'

const TABLE_NAME = 'championships'

const columns = ['id', 'name', 'year', 'status']

const fetchAll = async () => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'teams.id AS teamId',
      'teams.name AS teamName',
      'teams.badge AS teamBadge',
      'teamsChampionships.championshipId',
      'teamsChampionships.groupId AS teamGroupId',
      'rounds.id AS roundId',
      'rounds.code AS roundCode',
      'rounds.name AS roundName',
      'rounds.type AS roundType',
      'groups.id AS groupId',
      'groups.code AS groupCode',
      'groups.name AS groupName',
      'championshipTeamPosition.position',
      'championshipTeamPosition.points',
      'teamPosition.id AS teamPositionId',
      'teamPosition.name AS teamPositionName',
      'teamPosition.badge AS teamPositionBadge'
    ])
    .leftJoin(
      'teamsChampionships',
      'teamsChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .leftJoin('teams', 'teams.id', `teamsChampionships.teamId`)
    .leftJoin('rounds', 'rounds.championshipId', `${TABLE_NAME}.id`)
    .leftJoin('groups', 'groups.championshipId', `${TABLE_NAME}.id`)
    .leftJoin(
      'championshipsTeamsPositions AS championshipTeamPosition',
      'championshipTeamPosition.championshipId',
      `${TABLE_NAME}.id`
    )
    .leftJoin(
      'teams AS teamPosition',
      'teamPosition.id',
      `championshipTeamPosition.teamId`
    )
    .where({
      [`${TABLE_NAME}.status`]: STATUS.ACTIVE
    })

  return appendEntities(rows)
}

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'teams.id AS teamId',
      'teams.name AS teamName',
      'teams.badge AS teamBadge'
    ])
    .leftJoin(
      'teamsChampionships',
      'teamsChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .leftJoin('teams', 'teams.id', `teamsChampionships.teamId`)
    .where(
      appendWhere({
        [`${TABLE_NAME}.id`]: id,
        [`${TABLE_NAME}.status`]: STATUS.ACTIVE
      })
    )

  return appendEntities(rows)[0]
}

const fetchByLeague = async ({ leagueId }) => {
  const rows = await knex(TABLE_NAME)
    .select([`${TABLE_NAME}.*`, 'leaguesChampionships.enableGuesses'])
    .join(
      'leaguesChampionships',
      'leaguesChampionships.championshipId',
      `${TABLE_NAME}.id`
    )
    .where(
      appendWhere({
        leagueId,
        [`${TABLE_NAME}.status`]: STATUS.ACTIVE
      })
    )
    .groupBy(`${TABLE_NAME}.id`)

  return appendEntities(rows)
}

const appendEntities = (rows) =>
  pipe(
    reduce((result, row) => {
      const TEAMS_FIELDS = ['teamId', 'teamName', 'teamBadge', 'championshipId']
      const TEAMS_CHAMPIONSHIPS_FIELDS = ['teamGroupId']
      const ROUNDS_FIELDS = ['roundId', 'roundCode', 'roundName', 'roundType']
      const GROUPS_FIELDS = ['groupId', 'groupCode', 'groupName']
      const CHAMPIONSHIPS_TEAMS_POSITIONS_FIELDS = [
        'teamPositionId',
        'teamPositionName',
        'teamPositionBadge',
        'points',
        'position'
      ]

      const team = {
        id: row.teamId,
        name: row.teamName,
        badge: row.teamBadge
      }

      const round = {
        id: row.roundId,
        code: row.roundCode,
        name: row.roundName,
        type: row.roundType
      }

      const group = {
        id: row.groupId,
        name: row.groupName,
        code: row.groupCode
      }

      const position = {
        team: {
          id: row.teamPositionId,
          name: row.teamPositionName,
          badge: row.teamPositionBadge
        },
        teamId: row.teamPositionId,
        position: row.position,
        points: row.points
      }

      const teams = row.championshipId
        ? [...(result[row.id]?.teams || []), team]
        : result[row.id]?.teams || []

      const rounds = row.roundType
        ? [...(result[row.id]?.rounds || []), round]
        : result[row.id]?.rounds || []

      const positions = row.teamPositionId
        ? [...(result[row.id]?.positions || []), position]
        : result[row.id]?.positions || []

      const groups = row.groupId
        ? [...(result[row.id]?.groups || []), group].map((group) => {
            const teams = uniqBy('id', [
              ...(group.teams || []),
              ...(row.teamGroupId === group.id ? [team] : [])
            ])

            return {
              ...group,
              teams
            }
          })
        : result[row.id]?.groups || []

      return {
        ...result,
        [row.id]: {
          ...omit(
            [
              ...TEAMS_FIELDS,
              ...ROUNDS_FIELDS,
              ...GROUPS_FIELDS,
              ...TEAMS_CHAMPIONSHIPS_FIELDS,
              ...CHAMPIONSHIPS_TEAMS_POSITIONS_FIELDS
            ],
            row
          ),
          teams: uniqBy('id', teams),
          rounds: orderBy('code', 'asc', uniqBy('id', rounds)),
          groups: orderBy('code', 'asc', uniqBy('id', groups)),
          positions: orderBy('position', 'asc', uniqBy('position', positions)),
          hasGroups: groups.length > 0
        }
      }
    }, {}),
    values
  )(rows)

const appendWhere = ({ leagueId, ...where }) =>
  omitBy(isNil, {
    'leaguesChampionships.leagueId': leagueId,
    ...where
  })

const championshipsModel = baseModel(TABLE_NAME, columns)

export default {
  ...championshipsModel,
  fetchAll,
  fetchById,
  fetchByLeague
}

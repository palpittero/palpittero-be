import knex, { DB_DEFAULT_DATE_FN } from '../config/database'
import baseModel from './base.model'
import omitBy from 'lodash/fp/omitBy'
import isNil from 'lodash/fp/isNil'
import omit from 'lodash/fp/omit'

const TABLE_NAME = 'matches'
const columns = [
  'id',
  'homeTeamId',
  'awayTeamId',
  'regularTimeHomeTeamGoals',
  'regularTimeAwayTeamGoals',
  'extraTimeHomeTeamGoals',
  'extraTimeAwayTeamGoals',
  'regularTimeHomeTeamGoals',
  'penaltiesTimeAwayTeamGoals',
  'round',
  'result',
  'date',
  'status',
  'createdAt',
  'updatedAt',
  'homeTeamName',
  'awayTeamName'
]

export const MATCH_STATUS_QUERY = `
  IF(
    ${DB_DEFAULT_DATE_FN} > DATE_ADD(date, INTERVAL 240 MINUTE),
    "finished",
    IF(
      ${DB_DEFAULT_DATE_FN} < date AND DATE_ADD(${DB_DEFAULT_DATE_FN}, INTERVAL 15 MINUTE) > date,
      "preparation",
      IF (
        ${DB_DEFAULT_DATE_FN} < DATE_ADD(date, INTERVAL 240 MINUTE) AND ${DB_DEFAULT_DATE_FN} > date,
        "in_progress",
        "scheduled"
      )
    )
  ) AS status
`

const matchesModel = baseModel(TABLE_NAME, columns)

const fetchById = async (id) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      'round.name AS roundName',
      'round.code AS roundCode',
      'round.type AS roundType',
      'group.id AS groupId',
      'group.name AS groupName',
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(MATCH_STATUS_QUERY)
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join(
      'teamsChampionships AS homeTeamChampionship',
      'homeTeam.id',
      'homeTeamChampionship.teamId'
    )
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
    .leftJoin('groups AS group', 'group.id', `homeTeamChampionship.groupId`)
    .join(
      'championships AS championship',
      'round.championshipId',
      `championship.id`
    )
    .where({ 'matches.id': id })

  return appendEntities(rows)[0]
}

const fetchAll = async ({ status, date, roundId }) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      'round.name AS roundName',
      'round.code AS roundCode',
      'round.type AS roundType',
      'group.id AS groupId',
      'group.name AS groupName',
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(MATCH_STATUS_QUERY)
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join(
      'teamsChampionships AS homeTeamChampionship',
      'homeTeam.id',
      'homeTeamChampionship.teamId'
    )
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
    .leftJoin('groups AS group', 'group.id', `homeTeamChampionship.groupId`)
    .join(
      'championships AS championship',
      'round.championshipId',
      `championship.id`
    )
    .where(appendWhere({ status, roundId }))

  if (date) {
    rows.whereBetween('date', [`${date} 00:00:00`, `${date} 23:59:59`])
  }

  return appendEntities(rows)
}

const fetchByChampionship = async ({ championshipId }) => {
  const rows = await knex(TABLE_NAME)
    .select([
      `${TABLE_NAME}.*`,
      'homeTeam.name AS homeTeamName',
      'homeTeam.badge AS homeTeamBadge',
      'awayTeam.name AS awayTeamName',
      'awayTeam.badge AS awayTeamBadge',
      'round.name AS roundName',
      'round.code AS roundCode',
      'round.type AS roundType',
      'group.id AS groupId',
      'group.name AS groupName',
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(MATCH_STATUS_QUERY)
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join(
      'teamsChampionships AS homeTeamChampionship',
      'homeTeam.id',
      'homeTeamChampionship.teamId'
    )
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
    .join('groups AS group', 'group.id', `homeTeamChampionship.groupId`)
    .join(
      'championships AS championship',
      'round.championshipId',
      `championship.id`
    )
    .where({ 'round.championshipId': championshipId })

  return appendEntities(rows)
}

const deleteByTeams = (teamsIds) =>
  knex(TABLE_NAME)
    .del()
    .whereIn({ homeTeamId: teamsIds })
    .whereIn({ awayTeamId: teamsIds })

const appendEntities = (rows) => {
  const JOIN_FIELDS = [
    'homeTeamName',
    'homeTeamBadge',
    'awayTeamName',
    'awayTeamBadge',
    'roundName',
    'roundCode',
    'roundType',
    'roundChampionshipId',
    'championshipId',
    'championshipName',
    'championshipYear',
    'championshipStatus',
    'groupId',
    'groupName'
  ]

  return rows.reduce((result, row) => {
    return [
      ...result,
      {
        ...omit(JOIN_FIELDS, row),
        date: new Date(row.date),
        group: row.groupId
          ? {
              id: row.groupId,
              name: row.groupName
            }
          : null,
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
          id: row.roundId,
          name: row.roundName,
          code: row.roundCode,
          championship: {
            id: row.championshipId,
            name: row.championshipName,
            year: row.championshipYear,
            status: row.championshipStatus,
            hasGroups: !!row.groupId
          },
          type: row.roundType
        }
      }
    ]
  }, [])
}

const appendWhere = ({ status, roundId }) =>
  omitBy(isNil, {
    [`${TABLE_NAME}.status`]: status,
    [`${TABLE_NAME}.roundId`]: roundId
  })

export default {
  ...matchesModel,
  fetchById,
  fetchAll,
  fetchByChampionship,
  deleteByTeams
}

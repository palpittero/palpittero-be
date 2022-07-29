import knex from '../database'
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
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+60 minutes') > date, "preparation", "scheduled")) AS status`
      )
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
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
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+60 minutes') > date, "preparation", "scheduled")) AS status`
      )
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
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
      'championship.id AS championshipId',
      'championship.name AS championshipName',
      'championship.year AS championshipYear',
      'championship.status AS championshipStatus',
      knex.raw(
        `IIF(DATETIME('now') > DATETIME(date, '+240 minutes'), "finished", IIF(DATETIME('now') < date AND DATETIME(DATETIME('now'), '+60 minutes') > date, "preparation", "scheduled")) AS status`
      )
    ])
    .join('teams AS homeTeam', 'homeTeam.id', `${TABLE_NAME}.homeTeamId`)
    .join('teams AS awayTeam', 'awayTeam.id', `${TABLE_NAME}.awayTeamId`)
    .join('rounds AS round', 'round.id', `${TABLE_NAME}.roundId`)
    .join(
      'championships AS championship',
      'round.championshipId',
      `championship.id`
    )
    .where({ 'round.championshipId': championshipId })

  return appendEntities(rows)
}

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
    'championshipStatus'
  ]

  return rows.reduce((result, row) => {
    return [
      ...result,
      {
        ...omit(JOIN_FIELDS, row),
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
            status: row.championshipStatus
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
  fetchByChampionship
}

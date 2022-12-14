import {
  CHAMPIONSHIPS_ROUNDS,
  CHAMPIONSHIPS_ROUND_TYPE
} from '../championships/championships.constants'

const appendTeamsChampionships = ({ championshipId, teams }) =>
  teams.map((team) => ({
    championshipId,
    teamId: team.id,
    groupId: team.groupId || null
  }))

const appendChampionshipRoundsStrategy = {
  [CHAMPIONSHIPS_ROUNDS.SIMPLE]: ({ championshipId, rounds }) => {
    const rows = Array.from(Array(rounds).keys())

    return rows.map((round) => ({
      championshipId,
      name: `Rodada ${round + 1}`,
      code: round + 1,
      type: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME,
      ignoreGroups: round.ignoreGroups
    }))
  },
  [CHAMPIONSHIPS_ROUNDS.DETAILED]: ({ championshipId, rounds }) =>
    rounds.map(({ id, name, type, ignoreGroups }, index) => ({
      id,
      championshipId,
      name,
      code: index + 1,
      type,
      ignoreGroups
    }))
}

const appendChampionshipRounds = ({ championshipId, rounds, roundsType }) =>
  appendChampionshipRoundsStrategy[roundsType]({ championshipId, rounds })

const appendChampionshipGroups = ({ championshipId, groups }) =>
  groups.map(({ id, name, teams }, index) => ({
    id,
    championshipId,
    name,
    teams,
    code: index + 1
  }))

export {
  appendTeamsChampionships,
  appendChampionshipRounds,
  appendChampionshipGroups
}

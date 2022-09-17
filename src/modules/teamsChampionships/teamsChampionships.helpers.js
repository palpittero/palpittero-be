import {
  CHAMPIONSHIPS_ROUNDS,
  CHAMPIONSHIPS_ROUND_TYPE
} from '../championships/championships.constants'

const appendTeamsChampionships = ({ championshipId, teams }) =>
  teams.map((team) => ({
    championshipId,
    teamId: team.id
  }))

const appendChampionshipRoundsStrategy = {
  [CHAMPIONSHIPS_ROUNDS.SIMPLE]: ({ championshipId, rounds }) => {
    const rows = Array.from(Array(rounds).keys())

    return rows.map((round) => ({
      championshipId,
      name: `Rodada ${round + 1}`,
      code: round + 1,
      type: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME
    }))
  },
  [CHAMPIONSHIPS_ROUNDS.DETAILED]: ({ championshipId, rounds }) =>
    rounds.map(({ id, name, type }, index) => ({
      id,
      championshipId,
      name,
      code: index + 1,
      type
    }))
}

const appendChampionshipRounds = ({ championshipId, rounds, roundsType }) =>
  appendChampionshipRoundsStrategy[roundsType]({ championshipId, rounds })

export { appendTeamsChampionships, appendChampionshipRounds }

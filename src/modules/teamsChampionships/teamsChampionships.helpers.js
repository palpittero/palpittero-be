const appendTeamsChampionships = ({ championshipId, teams }) =>
  teams.map((team) => ({
    championshipId,
    teamId: team.id
  }))

const appendChampionshipRounds = ({ championshipId, rounds }) => {
  const rows = Array.from(Array(rounds).keys())

  return rows.map((round) => ({
    championshipId,
    name: `Rodada ${round + 1}`,
    code: round + 1,
    type: 'regularTime'
  }))
}

export { appendTeamsChampionships, appendChampionshipRounds }

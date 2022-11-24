const appendLeaguesChampionships = ({ leagueId, championships }) =>
  championships.map((championship) => ({
    championshipId: championship.id,
    enableGuesses: championship.enableGuesses,
    leagueId
  }))

export { appendLeaguesChampionships }

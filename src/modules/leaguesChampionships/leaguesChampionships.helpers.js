const appendLeaguesChampionships = ({ leagueId, championships }) =>
  championships.map((championship) => ({
    championshipId: championship.id,
    leagueId
  }))

export { appendLeaguesChampionships }

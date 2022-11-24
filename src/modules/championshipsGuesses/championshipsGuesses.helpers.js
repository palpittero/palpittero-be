const parseChampionshipGuesses = (
  championshipGuesses,
  { championshipId, leagueId, userId }
) =>
  championshipGuesses.map((championshipGuess) => ({
    ...championshipGuess,
    championshipId,
    leagueId,
    userId
  }))

export { parseChampionshipGuesses }

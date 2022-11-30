const appendLeaguesPrizes = ({ leagueId, prizes }) =>
  prizes.map((prize) => ({
    ...prize,
    leagueId
  }))

export { appendLeaguesPrizes }

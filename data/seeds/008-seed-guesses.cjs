exports.seed = async function (knex) {
  await knex('guesses').del()
  await knex('guesses').insert([
    {
      id: 1,
      userId: 1, // Dono
      leagueId: 1, // Primeira Liga
      matchId: 1, // Brasil x Argentinga
      homeTeamRegularTimeGoals: 2,
      awayTeamRegularTimeGoals: 0
    },
    {
      id: 2,
      userId: 3, // Colaborador
      leagueId: 1, // Segunda Liga
      matchId: 1, // Brasil x Argentinga
      homeTeamRegularTimeGoals: 0,
      awayTeamRegularTimeGoals: 2
    },
    {
      id: 3,
      userId: 2, // Convidado
      leagueId: 2, // Segunda Liga
      matchId: 1, // Brasil x Argentinga
      homeTeamRegularTimeGoals: 1,
      awayTeamRegularTimeGoals: 1
    }
  ])
}

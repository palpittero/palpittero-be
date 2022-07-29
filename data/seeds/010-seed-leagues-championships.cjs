exports.seed = async function (knex) {
  await knex('leaguesChampionships').del()
  await knex('leaguesChampionships').insert([
    {
      id: 1,
      leagueId: 1, // Primeira Liga
      championshipId: 1 // Copa do Mundo
    },
    {
      id: 2,
      leagueId: 2, // Segunda Liga
      championshipId: 1 // Copa do Mundo
    },
    {
      id: 3,
      leagueId: 2, // Segunda Liga
      championshipId: 2 // Campeonato Brasileiro
    }
  ])
}

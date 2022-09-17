exports.seed = async function (knex) {
  await knex('teamsChampionships').del()
  await knex('teamsChampionships').insert([
    {
      id: 1,
      teamId: 1, // Brasil
      championshipId: 1 // Copa do Mundo
    },
    {
      id: 2,
      teamId: 2, // Argentina
      championshipId: 1 // Copa do Mundo
    },
    {
      id: 3,
      teamId: 3, // Itália
      championshipId: 1 // Copa do Mundo
    },
    {
      id: 4,
      teamId: 4, // Alemanh
      championshipId: 1 // Copa do Mundo
    }
  ])
}

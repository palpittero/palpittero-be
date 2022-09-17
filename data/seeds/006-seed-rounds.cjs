exports.seed = async function (knex) {
  await knex('rounds').del()
  await knex('rounds').insert([
    {
      id: 1,
      code: 1,
      championshipId: 1, // Copa do Mundo
      name: 'Rodada 1 - Fase de Grupos',
      type: 'regularTime'
    },
    {
      id: 2,
      code: 2,
      championshipId: 1, // Copa do Mundo,
      name: 'Rodada 2 - Fase de Grupos',
      type: 'regularTime'
    },
    {
      id: 3,
      code: 3,
      championshipId: 1, // Copa do Mundo,
      name: 'Rodada 3 - Oitavas de Final',
      type: 'penalties'
    },
    {
      id: 4,
      code: 4,
      championshipId: 2, // Campeonato Brasileiro,
      name: 'Rodada 1',
      type: 'regularTime'
    }
  ])
}

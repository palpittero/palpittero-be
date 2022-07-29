exports.seed = async function (knex) {
  await knex('championships').del()
  await knex('championships').insert([
    {
      id: 1,
      name: 'Copa do Mundo',
      year: 2022
    },
    {
      id: 2,
      name: 'Campeonato Brasileiro',
      year: 2023
    }
  ])
}

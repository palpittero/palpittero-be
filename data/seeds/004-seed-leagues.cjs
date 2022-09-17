exports.seed = async function (knex) {
  await knex('leagues').del()
  await knex('leagues').insert([
    {
      id: 1,
      name: 'Primeira Liga Privada',
      badge: 'http://placeimg.com/64/64/any',
      private: true
    },
    {
      id: 2,
      name: 'Segunda Liga Pública',
      badge: 'http://placeimg.com/64/64/any'
    }
  ])
}

exports.seed = async function (knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      name: 'Dono',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'dono@palpittero.com',
      phone: '+5522999999999',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Convidado',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'convidado@palpittero.com',
      role: 'player'
    },
    {
      id: 3,
      name: 'Colaborador',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'colaborador@palpittero.com',
      phone: '+5522999999999',
      role: 'player'
    },
    {
      id: 4,
      name: 'Renegado',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'renegado@palpittero.com',
      role: 'player'
    }
  ])
}

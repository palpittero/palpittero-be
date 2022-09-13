exports.seed = async function (knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      name: 'Palpittero',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'system@palpittero.com',
      role: 'system'
    },
    {
      id: 2,
      name: 'Dono',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'dono@palpittero.com',
      phone: '+5522999999999',
      role: 'admin'
    },
    {
      id: 3,
      name: 'Convidado',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'convidado@palpittero.com',
      role: 'player'
    },
    {
      id: 4,
      name: 'Colaborador',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'colaborador@palpittero.com',
      phone: '+5522999999999',
      role: 'player'
    },
    {
      id: 5,
      name: 'Renegado',
      password: '$2b$10$wgZd2.ywV6RR0lzECserwuohg5NVhyDJeGjoztjjwUC3lvGlv/T3K',
      email: 'renegado@palpittero.com',
      role: 'player'
    }
  ])
}

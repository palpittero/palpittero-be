exports.seed = async function (knex) {
  await knex('usersLeagues').del()
  await knex('usersLeagues').insert([
    {
      id: 1,
      leagueId: 1,
      userId: 2, // Palpittero
      points: 0,
      owner: true,
      status: 'approved'
    },
    {
      id: 2,
      leagueId: 1,
      userId: 3, // Convidado
      points: 0,
      owner: false,
      status: 'invited'
    },
    {
      id: 3,
      leagueId: 1,
      userId: 4, // Colaborador
      points: 0,
      owner: false,
      status: 'approved'
    },
    {
      id: 4,
      leagueId: 2,
      userId: 3, // Convidado
      points: 0,
      owner: true,
      status: 'approved'
    },
    {
      id: 5,
      leagueId: 2,
      userId: 2, // Dono
      points: 0,
      owner: false,
      status: 'invited'
    },
    {
      id: 6,
      leagueId: 2,
      userId: 4, // Colaborador
      points: 0,
      owner: false,
      status: 'invited'
    }
  ])
}

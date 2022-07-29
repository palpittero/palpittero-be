exports.seed = async function (knex) {
  await knex('matches').del()
  await knex('matches').insert([
    {
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      date: '2022-05-30 14:00:00',
      regularTimeHomeTeamGoals: 2,
      regularTimeAwayTeamGoals: 0,
      result: 'homeTeamRegularTimeWin',
      roundId: 1
    },
    {
      id: 2,
      homeTeamId: 1,
      awayTeamId: 3,
      date: '2022-11-30 14:00:00',
      status: 'scheduled',
      roundId: 1
    },
    {
      id: 3,
      homeTeamId: 1,
      awayTeamId: 4,
      date: '2022-12-10 14:00:00',
      status: 'scheduled',
      roundId: 2
    },
    {
      id: 4,
      homeTeamId: 2,
      awayTeamId: 4,
      date: '2022-12-20 14:00:00',
      status: 'scheduled',
      roundId: 2
    }
  ])
}

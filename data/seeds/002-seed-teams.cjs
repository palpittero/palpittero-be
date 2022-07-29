exports.seed = async function (knex) {
  await knex('teams').del()
  await knex('teams').insert([
    {
      id: 1,
      name: 'Brasil',
      badge: 'https://cdn.countryflags.com/thumbs/brazil/flag-square-250.png',
      type: 'nationalTeam',
      country: 'world'
    },
    {
      id: 2,
      name: 'Argentina',
      badge:
        'https://cdn.countryflags.com/thumbs/argentina/flag-square-250.png',
      type: 'nationalTeam',
      country: 'world'
    },
    {
      id: 3,
      name: 'Itália',
      badge: 'https://cdn.countryflags.com/thumbs/italy/flag-square-250.png',
      type: 'nationalTeam',
      country: 'world'
    },
    {
      id: 4,
      name: 'Alemanha',
      badge: 'https://cdn.countryflags.com/thumbs/germany/flag-square-250.png',
      type: 'nationalTeam',
      country: 'world'
    },
    {
      id: 5,
      name: 'Real Madrid',
      badge:
        'https://content.sportslogos.net/logos/130/4017/full/643_-real_madrid-primary-.gif',
      type: 'club',
      country: 'Spain',
      nationalDivision: 1
    },
    {
      id: 6,
      name: 'Barcelona',
      badge:
        'https://content.sportslogos.net/logos/130/4016/full/954_-fc_barcelona-primary-.gif',
      type: 'club',
      country: 'Spain',
      nationalDivision: 1
    },
    {
      id: 7,
      name: 'Milan',
      badge:
        'https://content.sportslogos.net/logos/128/3992/full/131_-ac_milan-primary-.gif',
      type: 'club',
      country: 'Italy',
      nationalDivision: 1
    },
    {
      id: 8,
      name: 'Juventus',
      badge:
        'https://content.sportslogos.net/logos/128/3997/full/4488__juventus-primary-2017.png',
      type: 'club',
      country: 'Italy',
      nationalDivision: 1
    },
    {
      id: 9,
      name: 'Bayern Munch',
      badge:
        'https://content.sportslogos.net/logos/132/4069/full/376_-bayern_munich-primary-.gif',
      type: 'club',
      country: 'Germany',
      nationalDivision: 1
    },
    {
      id: 10,
      name: 'Borussia Dortmund',
      badge:
        'https://content.sportslogos.net/logos/132/4072/full/789_-borussia_dortmund-primary-.gif',
      type: 'club',
      country: 'Germany',
      nationalDivision: 1
    },
    {
      id: 11,
      name: 'Flamengo',
      badge:
        'https://content.sportslogos.net/logos/143/4455/full/738_-clube_de_regatas_do_flamengo-primary-.gif',
      type: 'club',
      country: 'Brazil',
      region: 'RJ',
      nationalDivision: 1
    },
    {
      id: 12,
      name: 'Fluminense',
      badge:
        'https://content.sportslogos.net/logos/143/4456/full/354_-fluminense_football_club-primary-.gif',
      type: 'club',
      country: 'Brazil',
      region: 'RJ',
      nationalDivision: 1
    }
  ])
}

module.exports = {
  up: function (knex) {
    return knex.schema.createTable('matches', function (table) {
      table.increments('id')
      table
        .integer('homeTeamId')
        .notNullable()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')

      table
        .integer('awayTeamId')
        .notNullable()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')

      table
        .integer('roundId')
        .notNullable()
        .references('id')
        .inTable('rounds')
        .onDelete('CASCADE')

      table.integer('regularTimeHomeTeamGoals')
      table.integer('regularTimeAwayTeamGoals')
      table.integer('extraTimeHomeTeamGoals')
      table.integer('extraTimeAwayTeamGoals')
      table.integer('penaltiesTimeHomeTeamGoals')
      table.integer('penaltiesTimeAwayTeamGoals')
      table.enu('result', [
        'homeTeamRegularTimeWin',
        'awayTeamRegularTimeWin',
        'homeTeamExtraTimeWin',
        'awayTeamExtraTimeWin',
        'homeTeamPenaltiesWin',
        'awayTeamPenaltiesWin',
        'draw'
      ])
      table.timestamp('date')
      table
        .enu('status', [
          'scheduled',
          'preparation',
          'regularTime',
          'extraTime',
          'penalties',
          'finished',
          'cancelled',
          'postponed',
          'limbo'
        ])
        .defaultsTo('scheduled')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('matches')
  }
}

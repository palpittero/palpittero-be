module.exports = {
  up: function (knex) {
    return knex.schema.createTable('guesses', function (table) {
      table.increments('id')
      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('matchId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table.integer('homeTeamRegularTimeGoals')
      table.integer('awayTeamRegularTimeGoals')
      table.integer('homeTeamExtraTimeGoals')
      table.integer('awayTeamExtraTimeGoals')
      table.integer('homeTeamPenaltiesTimeGoals')
      table.integer('awayTeamPenaltiesTimeGoals')
      table.integer('points')
      table.unique(['userId', 'matchId', 'leagueId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('guesses')
  }
}

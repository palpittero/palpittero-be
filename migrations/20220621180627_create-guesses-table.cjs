module.exports = {
  up: function (knex) {
    return knex.schema.createTable('guesses', function (table) {
      table.increments('id')
      table.integer('userId').notNullable().references('id').inTable('users')
      table.integer('matchId').notNullable().references('id').inTable('matches')
      table
        .integer('leagueId')
        .notNullable()
        .references('id')
        .inTable('leagues')
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

module.exports = {
  up: function (knex) {
    return knex.schema.createTable('guessesReport', function (table) {
      table.increments('id')
      table.integer('userId').notNullable().references('id').inTable('users')
      table
        .integer('leagueId')
        .notNullable()
        .references('id')
        .inTable('leagues')
      table.integer('matchId').notNullable().references('id').inTable('matches')
      table.integer('points').notNullable()
      table.unique(['userId', 'leagueId', 'matchId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('guessesReport')
  }
}

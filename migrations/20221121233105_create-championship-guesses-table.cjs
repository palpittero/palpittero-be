module.exports = {
  up: function (knex) {
    return knex.schema.createTable('championshipsGuesses', function (table) {
      table.increments('id')
      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table
        .integer('teamId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')
      table.integer('position')
      table.integer('points')
      table.timestamps(true, true, true)
      table.unique(
        ['championshipId', 'leagueId', 'userId', 'teamId'],
        'championshipsguesses_unique_index'
      )
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('championshipsGuesses')
  }
}

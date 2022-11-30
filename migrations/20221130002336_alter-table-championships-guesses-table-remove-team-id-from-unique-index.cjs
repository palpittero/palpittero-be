module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('championshipsGuesses', function (table) {
      table.dropForeign('userId')
      table.dropForeign('championshipId')
      table.dropForeign('leagueId')
      table.dropForeign('teamId')

      table.dropUnique(
        ['championshipId', 'leagueId', 'userId', 'teamId'],
        'championshipsguesses_unique_index'
      )

      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .alter()
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
        .alter()
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
        .alter()
      table
        .integer('teamId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')
        .alter()

      table.unique(
        ['championshipId', 'leagueId', 'userId'],
        'championshipsguesses_unique_index'
      )
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('championshipsGuesses', function (table) {
      table.dropForeign('championshipId')
      table.dropForeign('leagueId')
      table.dropForeign('userId')

      table.dropUnique(
        ['championshipId', 'leagueId', 'userId'],
        'championshipsguesses_unique_index'
      )

      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .alter()
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
        .alter()
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
        .alter()

      table.unique(
        ['championshipId', 'leagueId', 'userId', 'teamId'],
        'championshipsguesses_unique_index'
      )
    })
  }
}

module.exports = {
  up: function (knex) {
    return knex.schema.createTable(
      'championshipsTeamsPositions',
      function (table) {
        table.increments('id')
        table
          .integer('championshipId')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('championships')
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
          ['championshipId', 'teamId', 'position'],
          'championshipsteamspositions_unique_index'
        )
      }
    )
  },

  down: function (knex) {
    return knex.schema.dropTable('championshipsTeamsPositions')
  }
}

module.exports = {
  up: function (knex) {
    return knex.schema.createTable('teamsChampionships', function (table) {
      table.increments('id')
      table
        .integer('teamId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.unique(['teamId', 'championshipId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('teamsChampionships')
  }
}

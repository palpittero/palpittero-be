module.exports = {
  up: function (knex) {
    return knex.schema.createTable('teamsChampionships', function (table) {
      table.increments('id')
      table.integer('teamId').notNullable().references('id').inTable('teams')
      table
        .integer('championshipId')
        .notNullable()
        .references('id')
        .inTable('championships')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.unique(['teamId', 'championshipId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('teamsChampionships')
  }
}

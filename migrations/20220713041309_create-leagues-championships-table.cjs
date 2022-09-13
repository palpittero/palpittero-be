module.exports = {
  up: function (knex) {
    return knex.schema.createTable('leaguesChampionships', function (table) {
      table.increments('id')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.unique(['leagueId', 'championshipId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('leaguesChampionships')
  }
}

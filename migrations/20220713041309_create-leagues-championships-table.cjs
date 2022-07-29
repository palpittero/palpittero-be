module.exports = {
  up: function (knex) {
    return knex.schema.createTable('leaguesChampionships', function (table) {
      table.increments('id')
      table
        .integer('leagueId')
        .notNullable()
        .references('id')
        .inTable('leagues')
      table
        .integer('championshipId')
        .notNullable()
        .references('id')
        .inTable('championships')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.unique(['leagueId', 'championshipId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('leaguesChampionships')
  }
}

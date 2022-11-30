module.exports = {
  up: function (knex) {
    return knex.schema.createTable('leaguesPrizes', function (table) {
      table.increments('id')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table.integer('position').notNullable()
      table.decimal('amount').defaultTo(0)
      table.unique(['leagueId', 'position'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('leaguesPrizes')
  }
}

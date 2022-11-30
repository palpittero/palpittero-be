module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('leagues', function (table) {
      table.boolean('enablePrizes').defaultTo(0)
      table.decimal('ticketValue')
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('leagues', function (table) {
      table.dropColumn('enablePrizes')
      table.dropColumn('ticketValue')
    })
  }
}

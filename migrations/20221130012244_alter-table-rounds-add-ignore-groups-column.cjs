module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('rounds', function (table) {
      table.boolean('ignoreGroups').defaultTo(false)
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('rounds', function (table) {
      table.dropColumn('ignoreGroups')
    })
  }
}

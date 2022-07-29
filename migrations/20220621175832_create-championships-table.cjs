module.exports = {
  up: function (knex) {
    return knex.schema.createTable('championships', function (table) {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.integer('year', 4).notNullable()
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('championships')
  }
}

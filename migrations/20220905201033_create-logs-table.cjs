module.exports = {
  up: function (knex) {
    return knex.schema.createTable('logs', function (table) {
      table.increments('id')
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('action', 255).notNullable()
      table.text('data', 'longtext')
      table.text('stacktrace', 'longtext')
      table.enu('level', ['info', 'warning', 'error']).defaultTo('info')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('logs')
  }
}

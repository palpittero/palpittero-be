module.exports = {
  up: function (knex) {
    return knex.schema.createTable('rounds', function (table) {
      table.increments('id')
      table.integer('code').notNullable()
      table.string('name').notNullable()
      table
        .integer('championshipId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('championships')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .enu('type', ['regularTime', 'extraTime', 'penalties'])
        .defaultTo('regularTime')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('rounds')
  }
}

module.exports = {
  up: function (knex) {
    return knex.schema.createTable('groups', function (table) {
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
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('groups')
  }
}

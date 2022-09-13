module.exports = {
  up: function (knex) {
    return knex.schema.createTable('users', function (table) {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 255).notNullable()
      table.string('phone', 32)
      table.text('avatar', 'longtext')
      table.text('token')
      table.enu('role', ['admin', 'player', 'system']).defaultTo('player')
      table
        .enu('status', ['active', 'inactive', 'banned', 'deleted'])
        .defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('users')
  }
}

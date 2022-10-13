module.exports = {
  up: function (knex) {
    return knex.schema.createTable('leaguesInvitations', function (table) {
      table.increments('id')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table.string('email', 255).notNullable()
      table.enu('status', ['pending', 'approved']).defaultTo('pending')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('leaguesInvitations')
  }
}

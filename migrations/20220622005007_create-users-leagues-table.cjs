module.exports = {
  up: function (knex) {
    return knex.schema.createTable('usersLeagues', function (table) {
      table.increments('id')
      table
        .integer('leagueId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('leagues')
        .onDelete('CASCADE')
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.integer('points').defaultTo(0)
      table.boolean('owner').defaultTo(false)
      table.enu('status', ['invited', 'approved']).defaultTo('invited')
      table.unique(['userId', 'leagueId'])
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('usersLeagues')
  }
}

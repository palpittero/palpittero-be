module.exports = {
  up: function (knex) {
    return knex.schema.createTable('teams', function (table) {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('badge', 255)
      table.enu('type', ['club', 'nationalTeam'])
      table.string('country').notNullable()
      table.string('region')
      table.integer('nationalDivision')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('teams')
  }
}

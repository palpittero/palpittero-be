module.exports = {
  up: function (knex) {
    return knex.schema.createTable('leagues', function (table) {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('badge', 255)
      table.boolean('private').default(0)
      table
        .enu('pointsStrategy', ['grouped', 'accumulative'])
        .defaultTo('grouped')
      table.enu('status', ['active', 'inactive', 'deleted']).defaultTo('active')
      table.timestamps(true, true, true)
    })
  },

  down: function (knex) {
    return knex.schema.dropTable('leagues')
  }
}

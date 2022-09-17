module.exports = {
  up: function (knex) {
    return knex.schema.createTable('countries', function (table) {
      table.increments('id')
      table.string('name')
      table.string('fifa')
      table.string('flag')
      table.string('cca2')
      table.string('cca3')
      table.string('cioc')
    })
  },
  down: function (knex) {
    return knex.schema.dropTable('countries')
  }
}

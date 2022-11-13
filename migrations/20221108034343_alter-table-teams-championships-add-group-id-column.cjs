module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('teamsChampionships', function (table) {
      table
        .integer('groupId')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.unique(['teamId', 'championshipId', 'groupId'])
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('teamsChampionships', function (table) {
      table.dropUnique(['teamId', 'championshipId', 'groupId'])
      table.dropColumn('groupId')
    })
  }
}

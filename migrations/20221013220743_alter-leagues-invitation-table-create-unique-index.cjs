module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('leaguesInvitations', function (table) {
      table.unique(['leagueId', 'email'])
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('leaguesInvitations', function (table) {
      table.dropUnique(['leagueId', 'email'])
    })
  }
}

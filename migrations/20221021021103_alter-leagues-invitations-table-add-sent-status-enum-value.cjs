module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('leaguesInvitations', function (table) {
      table
        .enu('status', ['pending', 'sent', 'approved'])
        .defaultTo('pending')
        .alter()
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('leaguesInvitations', function (table) {
      table.enu('status', ['pending', 'approved']).defaultTo('pending').alter()
    })
  }
}

module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('matches', function (table) {
      table
        .enu('status', [
          'scheduled',
          'preparation',
          'regularTime',
          'extraTime',
          'penalties',
          'finished',
          'cancelled',
          'postponed',
          'limbo'
        ])
        .alter()
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('matches', function (table) {
      table
        .enu('status', [
          'scheduled',
          'preparation',
          'regularTime',
          'extraTime',
          'penalties',
          'finished',
          'cancelled',
          'postponed',
          'limbo'
        ])
        .defaultsTo('scheduled')
    })
  }
}

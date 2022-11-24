module.exports = {
  up: function (knex) {
    return knex.schema.alterTable('leaguesChampionships', function (table) {
      table.boolean('enableGuesses').defaultTo(false)
    })
  },

  down: function (knex) {
    return knex.schema.alterTable('leaguesChampionships', function (table) {
      table.dropColumn('enableGuesses')
    })
  }
}

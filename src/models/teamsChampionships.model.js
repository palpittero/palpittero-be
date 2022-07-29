import baseModel from './base.model'

const TABLE_NAME = 'teamsChampionships'

const teamsChampionshipsModel = baseModel(TABLE_NAME)

export default {
  ...teamsChampionshipsModel
}

import knex from '../config/database'
import baseModel from './base.model'

const TABLE_NAME = 'teamsChampionships'

const unlinkTeamGroups = async (groupsIds) =>
  knex(TABLE_NAME).update({ groupId: null }).whereIn('groupId', groupsIds)

const teamsChampionshipsModel = baseModel(TABLE_NAME)

export default {
  ...teamsChampionshipsModel,
  unlinkTeamGroups
}

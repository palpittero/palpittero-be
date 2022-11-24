import baseModel from './base.model'

export const TABLE_NAME = 'championshipsTeamsPositions'
export const TABLE_FIELDS = [
  'id',
  'championshipId',
  'teamId',
  'position',
  'createdAt',
  'updatedAt'
]

export default baseModel(TABLE_NAME)

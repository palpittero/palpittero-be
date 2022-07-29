import usersLeaguesModel from '../../models/usersLeagues.model'
import leaguesModel from '../../models/leagues.model'
import { USERS_LEAGUES_STATUSES } from './usersLeagues.constants'

const inviteUsers = async (req, res) => {
  const { leagueId, users } = req.body

  const league = leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.status(404).json()
  }

  const status = league.private
    ? USERS_LEAGUES_STATUSES.INVITED
    : USERS_LEAGUES_STATUSES.APPROVED

  const usersLeagues = users.map((user) => ({
    userId: user.id,
    leagueId,
    status
  }))

  await usersLeaguesModel.replace(usersLeagues)

  res.status(201).json()
}

const approveUser = async (req, res) => {
  const { leagueId, userId } = req.body

  await usersLeaguesModel.update({
    status: USERS_LEAGUES_STATUSES.APPROVED,
    leagueId,
    userId
  })

  res.status(200).json()
}

const deleteUser = async (req, res) => {
  const { leagueId, userId } = req.params

  await usersLeaguesModel.delete({
    leagueId,
    userId
  })

  res.status(200).json()
}

export { inviteUsers, approveUser, deleteUser }

import usersLeaguesModel from '../../models/usersLeagues.model'
import leaguesModel from '../../models/leagues.model'
import { USERS_LEAGUES_STATUSES } from './usersLeagues.constants'
import { validateToken } from '../../shared/token.service'
import usersModel from '../../models/users.model'

const inviteUsers = async (req, res) => {
  const { leagueId, users } = req.body

  const league = leaguesModel.fetchById(leagueId)

  if (!league) {
    return res.sendStatus(404)
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

  res.sendStatus(201)
}

const acceptInvitation = async (req, res) => {
  const { token } = req.params
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateToken({ token, secret })

  if (!tokenValidation) {
    return res.sendStatus(400)
  }

  const { email, leagueId } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  const userLeague = await usersLeaguesModel.fetchByUser({ id: user.id })

  if (userLeague?.status === USERS_LEAGUES_STATUSES.APPROVED) {
    return res.sendStatus(200)
  }

  await usersLeaguesModel.replace({
    leagueId,
    userId: user.id,
    status: USERS_LEAGUES_STATUSES.APPROVED
  })

  return res.sendStatus(200)
}

const deleteUser = async (req, res) => {
  const { leagueId, userId } = req.params

  await usersLeaguesModel.delete({
    leagueId,
    userId
  })

  res.sendStatus(200)
}

export { inviteUsers, acceptInvitation, deleteUser }

import { USERS_LEAGUES_STATUSES } from './usersLeagues.constants'

const appendUsersLeagues = ({ leagueId, users, ownerId }) => {
  const owner = {
    userId: ownerId,
    leagueId,
    status: USERS_LEAGUES_STATUSES.APPROVED,
    owner: true
  }

  if (users?.length) {
    const usersLeagues = users
      .filter(({ id }) => {
        console.log(id, ownerId)
        return id !== ownerId
      })
      .map((user) => ({
        userId: user.id,
        leagueId,
        status: USERS_LEAGUES_STATUSES.APPROVED,
        owner: false
      }))

    return [...usersLeagues, owner]
  }

  return [owner]
}

export { appendUsersLeagues }

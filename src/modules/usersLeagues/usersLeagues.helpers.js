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
      .filter(({ id }) => id !== ownerId)
      .map((user) => ({
        userId: user.id,
        leagueId,
        owner: false
      }))

    return [...usersLeagues, owner]
  }

  return [owner]
}

export { appendUsersLeagues }

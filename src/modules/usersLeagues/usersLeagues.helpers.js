import { USERS_LEAGUES_STATUSES } from './usersLeagues.constants'

const appendUsersLeagues = ({ leagueId, users, ownerId }) => {
  const owner = ownerId
    ? {
        userId: ownerId,
        leagueId,
        status: USERS_LEAGUES_STATUSES.APPROVED,
        owner: true
      }
    : null

  if (users?.length) {
    const usersLeagues = users
      .filter((user) => user?.id && user.id !== ownerId)
      .map((user) => ({
        userId: user.id,
        leagueId,
        owner: false
      }))

    return owner ? [...usersLeagues, owner] : usersLeagues
  }

  return owner ? [owner] : []
}

export { appendUsersLeagues }

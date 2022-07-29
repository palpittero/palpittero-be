import lodash from 'lodash/fp'
const { pipe, filter, reduce } = lodash

import { guessPointsStrategy } from './guessesReport.strategy'

export const generateGuessesReport = (guesses) => {
  pipe(
    filter(({ match }) => match.status === 'finished'),
    reduce((result, guess) => {
      const { userId, leagueId, matchId } = guess
      const points = guessPointsStrategy[guess.league.pointsStrategy](guess)

      return [
        ...result,
        {
          userId,
          leagueId,
          matchId,
          points
        }
      ]
    }, [])
  )(guesses)
}

export const parseRegisterGuesses = ({ guesses, userId }) =>
  guesses.map(
    ({
      homeTeamRegularTimeGoals,
      awayTeamRegularTimeGoals,
      leagueId,
      matchId
    }) => ({
      homeTeamRegularTimeGoals,
      awayTeamRegularTimeGoals,
      leagueId,
      matchId,
      userId
    })
  )

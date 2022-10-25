const { pipe, filter, reduce, pick } = lodash
import lodash from 'lodash/fp'
import { TABLE_FIELDS } from '../../models/guesses.model'
import { MATCH_STATUSES } from '../matches/matches.constants'

import { guessPointsStrategy } from './guessesReport.strategy'

export const calculateGuessesPoints = (guesses) =>
  pipe(
    filter(({ match }) => match.status === MATCH_STATUSES.FINISHED),
    reduce((result, guess) => {
      const points = guessPointsStrategy[guess.league.pointsStrategy](guess)

      return [
        ...result,
        {
          ...pick(TABLE_FIELDS, guess),
          points
        }
      ]
    }, [])
  )(guesses)

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

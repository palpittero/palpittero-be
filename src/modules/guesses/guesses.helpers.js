import lodash from 'lodash/fp'
const { pipe, filter, reduce, pick, uniqBy, isNil } = lodash
// const { pipe, filter, reduce, pick } = lodash
import { TABLE_FIELDS as MATCHES_GUESSES_TABLE_FIELDS } from '../../models/guesses.model'
import { TABLE_FIELDS as CHAMPIONSHIPS_GUESSES_TABLE_FIELDS } from '../../models/championshipsGuesses.model'
import { MATCH_STATUSES } from '../matches/matches.constants'

import {
  guessPointsStrategy,
  championshipGuessPointsStrategy
} from './guessesReport.strategy'

export const calculateGuessesPoints = (guesses) =>
  pipe(
    filter(
      ({ match }) =>
        match.status === MATCH_STATUSES.FINISHED &&
        !isNil(match.regularTimeHomeTeamGoals) &&
        !isNil(match.regularTimeAwayTeamGoals)
    ),
    reduce((result, guess) => {
      const points = guessPointsStrategy[guess.league.pointsStrategy](guess)

      return [
        ...result,
        {
          ...pick(MATCHES_GUESSES_TABLE_FIELDS, guess),
          points
        }
      ]
    }, [])
  )(guesses)

export const calculateChampionshipsGuessesPoints = (guesses) =>
  pipe(
    // filter(({ match }) => match.status === MATCH_STATUSES.FINISHED),
    reduce((result, guess) => {
      const points = championshipGuessPointsStrategy.grouped(guess)

      return [
        ...result,
        {
          ...pick(CHAMPIONSHIPS_GUESSES_TABLE_FIELDS, guess),
          points
        }
      ]
    }, [])
  )(guesses)

export const parseRegisterMatchesGuesses = ({
  matchesGuesses,
  userId,
  matchesStatuses
}) =>
  matchesGuesses.reduce(
    (
      acc,
      {
        homeTeamRegularTimeGoals,
        awayTeamRegularTimeGoals,
        homeTeamPenaltiesTimeGoals,
        awayTeamPenaltiesTimeGoals,
        leagueId,
        matchId
      }
    ) => {
      const guess = {
        homeTeamRegularTimeGoals,
        awayTeamRegularTimeGoals,
        homeTeamPenaltiesTimeGoals,
        awayTeamPenaltiesTimeGoals,
        leagueId,
        matchId,
        userId
      }

      const isGuessValid = matchesStatuses[matchId] === MATCH_STATUSES.SCHEDULED

      return isGuessValid
        ? {
            ...acc,
            validGuesses: [...acc.validGuesses, guess]
          }
        : {
            ...acc,
            invalidGuesses: [...acc.invalidGuesses, guess]
          }
    },
    { validGuesses: [], invalidGuesses: [] }
  )

export const parseCopyMatchesGuesses = ({ matchesGuesses, targetLeagueId }) =>
  matchesGuesses.map(
    ({
      homeTeamRegularTimeGoals,
      awayTeamRegularTimeGoals,
      homeTeamPenaltiesTimeGoals,
      awayTeamPenaltiesTimeGoals,
      userId,
      matchId
    }) => ({
      homeTeamRegularTimeGoals,
      awayTeamRegularTimeGoals,
      homeTeamPenaltiesTimeGoals,
      awayTeamPenaltiesTimeGoals,
      leagueId: targetLeagueId,
      userId,
      matchId
    })
  )

export const parseCopyChampionshipsGuesses = ({
  championshipsGuesses,
  targetLeagueId
}) =>
  championshipsGuesses.map(({ userId, teamId, championshipId, position }) => ({
    leagueId: targetLeagueId,
    userId,
    teamId,
    championshipId,
    position
  }))

export const parseRegisterChampionshipsGuesses = (championshipsGuesses) =>
  championshipsGuesses
    .filter(({ teamId }) => teamId)
    .map(({ leagueId, userId, teamId, championshipId, position }) => ({
      championshipId,
      leagueId,
      userId,
      teamId,
      position
    }))

export const parseDeleteChampionshipsGuesses = (championshipsGuesses) =>
  uniqBy(
    ({ championshipId, leagueId, userId }) =>
      [championshipId, leagueId, userId].join(),
    championshipsGuesses
  ).map(({ championshipId, leagueId, userId }) => ({
    championshipId,
    leagueId,
    userId
  }))

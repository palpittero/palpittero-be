import { CHAMPIONSHIPS_ROUND_TYPE } from '../championships/championships.constants'
import { GUESS_POINTS_STRATEGY } from './guesses.constants'

const hasSpottedRegularTimeExactScore = (guess) => {
  const hasSpottedRegularTimeHomeTeamGoals =
    guess.homeTeamRegularTimeGoals === guess.match.regularTimeHomeTeamGoals

  const hasSpottedRegularTimeAwayGoals =
    guess.awayTeamRegularTimeGoals === guess.match.regularTimeAwayTeamGoals

  return hasSpottedRegularTimeHomeTeamGoals && hasSpottedRegularTimeAwayGoals
}

const hasSpottedRegularTimeWrongScoreDraw = (guess) => {
  const hasMatchDrawn =
    guess.match.regularTimeHomeTeamGoals ===
    guess.match.regularTimeAwayTeamGoals

  const hasGuessDrawn =
    guess.homeTeamRegularTimeGoals === guess.awayTeamRegularTimeGoals

  return (
    hasMatchDrawn && hasGuessDrawn && !hasSpottedRegularTimeExactScore(guess)
  )
}

const hasSpottedRegularTimeWinnerAndGoals = (guess) =>
  hasSpottedRegularTimeWinner(guess) && hasSpottedRegularTimeWinnerGoals(guess)

const hasSpottedRegularTimeLoserGoalsAndWinner = (guess) => {
  return (
    hasSpottedRegularTimeWinner(guess) &&
    !hasSpottedRegularTimeWinnerGoals(guess) &&
    hasSpottedRegularTimeLoserGoals(guess)
  )
}

const hasSpottedRegularTimeWinner = (guess) => {
  const matchWinnerTeamId = hasRegularTimeMatchHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasRegularTimeMatchAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  const guessWinnerTeamId = hasGuessRegularTimeHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasGuessRegularTimeAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  return matchWinnerTeamId === guessWinnerTeamId
}

const hasRegularTimeMatchHomeTeamWon = (guess) => {
  return (
    guess.match.regularTimeHomeTeamGoals > guess.match.regularTimeAwayTeamGoals
  )
}

const hasRegularTimeMatchAwayTeamWon = (guess) => {
  return (
    guess.match.regularTimeHomeTeamGoals < guess.match.regularTimeAwayTeamGoals
  )
}

const hasGuessRegularTimeHomeTeamWon = (guess) =>
  guess.homeTeamRegularTimeGoals > guess.awayTeamRegularTimeGoals

const hasGuessRegularTimeAwayTeamWon = (guess) =>
  guess.homeTeamRegularTimeGoals < guess.awayTeamRegularTimeGoals

const hasSpottedRegularTimeWinnerGoals = (guess) => {
  const matchWinnerRegularTimeGoals = hasRegularTimeMatchHomeTeamWon(guess)
    ? guess.match.regularTimeHomeTeamGoals
    : hasRegularTimeMatchAwayTeamWon(guess)
    ? guess.match.regularTimeAwayTeamGoals
    : null

  const guessWinnerRegularTimeGoals = hasGuessRegularTimeHomeTeamWon(guess)
    ? guess.homeTeamRegularTimeGoals
    : hasGuessRegularTimeAwayTeamWon(guess)
    ? guess.awayTeamRegularTimeGoals
    : null

  return matchWinnerRegularTimeGoals === guessWinnerRegularTimeGoals
}

const hasSpottedRegularTimeLoserGoals = (guess) => {
  const matchLoserRegularTimeGoals = hasRegularTimeMatchHomeTeamWon(guess)
    ? guess.match.regularTimeAwayTeamGoals
    : hasRegularTimeMatchAwayTeamWon(guess)
    ? guess.match.regularTimeHomeTeamGoals
    : null

  const guessLoserRegularTimeGoals = hasGuessRegularTimeHomeTeamWon(guess)
    ? guess.awayTeamRegularTimeGoals
    : hasGuessRegularTimeAwayTeamWon(guess)
    ? guess.homeTeamRegularTimeGoals
    : null

  return matchLoserRegularTimeGoals === guessLoserRegularTimeGoals
}

const hasSpottedRegularTimeWinnerWrongGoals = (guess) => {
  return (
    hasSpottedRegularTimeWinner(guess) &&
    !hasSpottedRegularTimeWinnerGoals(guess) &&
    !hasSpottedRegularTimeLoserGoals(guess)
  )
}

const hasSpottedRegularTimeAnyTeamGoals = (guess) => {
  return (
    guess.homeTeamRegularTimeGoals === guess.match.regularTimeHomeTeamGoals ||
    guess.awayTeamRegularTimeGoals === guess.match.regularTimeAwayTeamGoals
  )
}

const hasSpottedPenaltiesTimeExactScore = (guess) => {
  const hasSpottedPenaltiesTimeHomeTeamGoals =
    guess.homeTeamPenaltiesTimeGoals === guess.match.penaltiesTimeHomeTeamGoals

  const hasSpottedPenaltiesTimeAwayGoals =
    guess.awayTeamPenaltiesTimeGoals === guess.match.penaltiesTimeAwayTeamGoals

  return (
    hasSpottedPenaltiesTimeHomeTeamGoals && hasSpottedPenaltiesTimeAwayGoals
  )
}

const hasSpottedPenaltiesTimeWinnerAndGoals = (guess) =>
  hasSpottedPenaltiesTimeWinner(guess) &&
  hasSpottedPenaltiesTimeWinnerGoals(guess)

const hasSpottedPenaltiesTimeWinner = (guess) => {
  const penaltiesWinnerTeamId = hasPenaltiesTimeMatchHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasPenaltiesTimeMatchAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  const guessPenaltiesWinnerTeamId = hasGuessPenaltiesTimeHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasGuessPenaltiesTimeAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  return penaltiesWinnerTeamId === guessPenaltiesWinnerTeamId
}

const hasSpottedPenaltiesTimeWinnerGoals = (guess) => {
  const matchWinnerPenaltiesTimeGoals = hasPenaltiesTimeMatchHomeTeamWon(guess)
    ? guess.match.penaltiesTimeHomeTeamGoals
    : hasPenaltiesTimeMatchAwayTeamWon(guess)
    ? guess.match.penaltiesTimeAwayTeamGoals
    : null

  const guessWinnerPenaltiesTimeGoals = hasGuessPenaltiesTimeHomeTeamWon(guess)
    ? guess.homeTeamPenaltiesTimeGoals
    : hasGuessPenaltiesTimeAwayTeamWon(guess)
    ? guess.awayTeamPenaltiesTimeGoals
    : null

  return matchWinnerPenaltiesTimeGoals === guessWinnerPenaltiesTimeGoals
}

const hasPenaltiesTimeMatchHomeTeamWon = (guess) => {
  return (
    guess.match.penaltiesTimeHomeTeamGoals >
    guess.match.penaltiesTimeAwayTeamGoals
  )
}

const hasPenaltiesTimeMatchAwayTeamWon = (guess) => {
  return (
    guess.match.penaltiesTimeHomeTeamGoals <
    guess.match.penaltiesTimeAwayTeamGoals
  )
}

const hasGuessPenaltiesTimeHomeTeamWon = (guess) =>
  guess.homeTeamPenaltiesTimeGoals > guess.awayTeamPenaltiesTimeGoals

const hasGuessPenaltiesTimeAwayTeamWon = (guess) =>
  guess.homeTeamPenaltiesTimeGoals < guess.awayTeamPenaltiesTimeGoals

const hasSpottedPenaltiesTimeLoserGoalsAndWinner = (guess) => {
  return (
    hasSpottedPenaltiesTimeWinner(guess) &&
    !hasSpottedPenaltiesTimeWinnerGoals(guess) &&
    hasSpottedPenaltiesTimeLoserGoals(guess)
  )
}

const hasSpottedPenaltiesTimeWinnerWrongGoals = (guess) => {
  return (
    hasSpottedPenaltiesTimeWinner(guess) &&
    !hasSpottedPenaltiesTimeWinnerGoals(guess) &&
    !hasSpottedPenaltiesTimeLoserGoals(guess)
  )
}

const hasSpottedPenaltiesTimeLoserGoals = (guess) => {
  const matchLoserPenaltiesTimeGoals = hasPenaltiesTimeMatchHomeTeamWon(guess)
    ? guess.match.penaltiesTimeAwayTeamGoals
    : hasPenaltiesTimeMatchAwayTeamWon(guess)
    ? guess.match.penaltiesTimeHomeTeamGoals
    : null

  const guessLoserPenaltiesTimeGoals = hasGuessPenaltiesTimeHomeTeamWon(guess)
    ? guess.awayTeamPenaltiesTimeGoals
    : hasGuessPenaltiesTimeAwayTeamWon(guess)
    ? guess.homeTeamPenaltiesTimeGoals
    : null

  return matchLoserPenaltiesTimeGoals === guessLoserPenaltiesTimeGoals
}

const hasSpottedPenaltiesTimeAnyTeamGoals = (guess) => {
  return (
    guess.homeTeamPenaltiesTimeGoals ===
      guess.match.penaltiesTimeHomeTeamGoals ||
    guess.awayTeamPenaltiesTimeGoals === guess.match.penaltiesTimeAwayTeamGoals
  )
}

const calculateGuessPointsGrouped = (guess) => {
  if (hasSpottedRegularTimeExactScore(guess)) {
    return 5
  } else if (
    hasSpottedRegularTimeWrongScoreDraw(guess) ||
    hasSpottedRegularTimeWinnerAndGoals(guess)
  ) {
    return 4
  } else if (hasSpottedRegularTimeLoserGoalsAndWinner(guess)) {
    return 3
  } else if (hasSpottedRegularTimeWinnerWrongGoals(guess)) {
    return 2
  } else if (hasSpottedRegularTimeAnyTeamGoals(guess)) {
    return 1
  }

  return 0
}

const calculateGuessBonusPointsGrouped = (guess) => {
  if (guess.match.round.type === CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME) {
    return 0
  }

  if (hasSpottedPenaltiesTimeExactScore(guess)) {
    return 5
  } else if (hasSpottedPenaltiesTimeWinnerAndGoals(guess)) {
    return 4
  } else if (hasSpottedPenaltiesTimeLoserGoalsAndWinner(guess)) {
    return 3
  } else if (hasSpottedPenaltiesTimeWinnerWrongGoals(guess)) {
    return 2
  } else if (hasSpottedPenaltiesTimeAnyTeamGoals(guess)) {
    return 1
  }

  return 0
}

export const guessPointsStrategy = {
  [GUESS_POINTS_STRATEGY.GROUPED]: (guess) => {
    const points = calculateGuessPointsGrouped(guess)
    const bonusPoints = calculateGuessBonusPointsGrouped(guess)

    return points + bonusPoints
  }
}

const calculateChampionshipGuessPointsGrouped = (guess) => {
  const championshipTeamPosition = guess.championship.positions.find(
    ({ position }) => guess.position === position
  )

  if (!championshipTeamPosition) return null

  return guess.teamId === championshipTeamPosition.teamId &&
    guess.position === championshipTeamPosition.position
    ? 10
    : 0
}

export const championshipGuessPointsStrategy = {
  [GUESS_POINTS_STRATEGY.GROUPED]: (guess) =>
    calculateChampionshipGuessPointsGrouped(guess)
}

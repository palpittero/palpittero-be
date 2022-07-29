import { GUESS_POINTS_STRATEGY } from './guesses.constants'

const hasSpottedExactScore = (guess) => {
  const hasSpottedRegularTimeHomeTeamGoals =
    guess.homeTeamRegularTimeGoals === guess.match.regularTimeHomeTeamGoals

  const hasSpottedRegularTimeAwayGoals =
    guess.awayTeamRegularTimeGoals === guess.match.regularTimeAwayTeamGoals

  return hasSpottedRegularTimeHomeTeamGoals && hasSpottedRegularTimeAwayGoals
}

const hasSpottedWrongScoreDraw = (guess) => {
  const hasMatchDrawn =
    guess.match.regularTimeHomeTeamGoals ===
    guess.match.regularTimeAwayTeamGoals

  const hasGuessDrawn =
    guess.homeTeamRegularTimeGoals === guess.awayTeamRegularTimeGoals

  return hasMatchDrawn && hasGuessDrawn && !hasSpottedExactScore(guess)
}

const hasSpottedWinnerAndGoals = (guess) =>
  hasSpottedWinner(guess) && hasSpottedWinnerGoals(guess)

const hasSpottedLoserGoalsAndWinner = (guess) => {
  return (
    hasSpottedWinner(guess) &&
    !hasSpottedWinnerGoals(guess) &&
    hasSpottedLoserGoals(guess)
  )
}

const hasSpottedWinner = (guess) => {
  const matchWinnerTeamId = hasMatchHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasMatchAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  const guessWinnerTeamId = hasGuessHomeTeamWon(guess)
    ? guess.match.homeTeamId
    : hasGuessAwayTeamWon(guess)
    ? guess.match.awayTeamId
    : null

  return matchWinnerTeamId === guessWinnerTeamId
}

const hasMatchHomeTeamWon = (guess) => {
  return (
    guess.match.regularTimeHomeTeamGoals > guess.match.regularTimeAwayTeamGoals
  )
}

const hasMatchAwayTeamWon = (guess) => {
  return (
    guess.match.regularTimeHomeTeamGoals < guess.match.regularTimeAwayTeamGoals
  )
}

const hasGuessHomeTeamWon = (guess) =>
  guess.homeTeamRegularTimeGoals > guess.awayTeamRegularTimeGoals

const hasGuessAwayTeamWon = (guess) =>
  guess.homeTeamRegularTimeGoals < guess.awayTeamRegularTimeGoals

const hasSpottedWinnerGoals = (guess) => {
  const matchWinnerRegularTimeGoals = hasMatchHomeTeamWon(guess)
    ? guess.match.regularTimeHomeTeamGoals
    : hasMatchAwayTeamWon(guess)
    ? guess.match.regularTimeAwayTeamGoals
    : null

  const guessWinnerRegularTimeGoals = hasGuessHomeTeamWon(guess)
    ? guess.homeTeamRegularTimeGoals
    : hasGuessAwayTeamWon(guess)
    ? guess.awayTeamRegularTimeGoals
    : null

  return matchWinnerRegularTimeGoals === guessWinnerRegularTimeGoals
}

const hasSpottedLoserGoals = (guess) => {
  const matchLoserRegularTimeGoals = hasMatchHomeTeamWon(guess)
    ? guess.match.regularTimeAwayTeamGoals
    : hasMatchAwayTeamWon(guess)
    ? guess.match.regularTimeHomeTeamGoals
    : null

  const guessLoserRegularTimeGoals = hasGuessHomeTeamWon(guess)
    ? guess.awayTeamRegularTimeGoals
    : hasGuessAwayTeamWon(guess)
    ? guess.homeTeamRegularTimeGoals
    : null

  return matchLoserRegularTimeGoals === guessLoserRegularTimeGoals
}

const hasSpottedWinnerWrongGoals = (guess) => {
  return (
    hasSpottedWinner(guess) &&
    !hasSpottedWinnerGoals(guess) &&
    !hasSpottedLoserGoals(guess)
  )
}

const calculateGuessPointsGrouped = (guess) => {
  if (hasSpottedExactScore(guess)) {
    return 4
  } else if (
    hasSpottedWrongScoreDraw(guess) ||
    hasSpottedWinnerAndGoals(guess)
  ) {
    return 3
  } else if (hasSpottedLoserGoalsAndWinner(guess)) {
    return 2
  } else if (hasSpottedWinnerWrongGoals(guess)) {
    return 1
  }

  return 0
}

export const guessPointsStrategy = {
  [GUESS_POINTS_STRATEGY.GROUPED]: calculateGuessPointsGrouped
}

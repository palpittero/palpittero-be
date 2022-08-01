import guessesModel from '../../models/guesses.model'
import guessesReportModel from '../../models/guessesReport.model'
import { generateGuessesReport, parseRegisterGuesses } from './guesses.helpers'

const getGuesses = async (req, res) => {
  const { userId, leagueId, matchId, roundId } = req.query

  const guesses = await guessesModel.fetchAll({
    userId,
    leagueId,
    matchId,
    roundId
  })

  res.json({
    data: guesses
  })
}

const getGuess = async (req, res) => {
  const id = parseInt(req.params.id)
  const guess = await guessesModel.fetchById(id)

  if (!guess) {
    return res.sendStatus(404)
  }

  return res.json({
    data: guess
  })
}

const createGuess = async (req, res) => {
  const {
    userId,
    leagueId,
    matchId,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals
  } = req.body

  const [id] = await guessesModel.insert({
    userId,
    leagueId,
    matchId,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals
  })

  res.status(201).json({ data: id })
}

const registerGuesses = async (req, res) => {
  const { guesses } = req.body
  const userId = res.locals.jwt.user.id
  const parsedGuesses = parseRegisterGuesses({ guesses, userId })
  await guessesModel.replace(parsedGuesses)

  res.sendStatus(201)
}

const updateGuess = async (req, res) => {
  const id = parseInt(req.params.id)
  const {
    userId,
    leagueId,
    matchId,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals
  } = req.body

  const guess = await guessesModel.fetchById(id)

  if (!guess) {
    return res.sendStatus(404)
  }

  await guessesModel.update({
    userId,
    leagueId,
    matchId,
    regularTimeHomeTeamGoals,
    regularTimeAwayTeamGoals
  })

  return res.json({
    data: id
  })
}

const deleteGuess = async (req, res) => {
  const id = parseInt(req.params.id)
  const guess = await guessesModel.fetchById(id)

  if (!guess) {
    return res.sendStatus(404)
  }

  await guessesModel.delete({ id })
  return res.sendStatus(204)
}

const processGuesses = async (req, res) => {
  const guesses = await guessesModel.fetchAll()

  const guessesReport = generateGuessesReport(guesses)

  await guessesReportModel.replace(guessesReport)
  res.sendStatus(200)
}

export {
  getGuesses,
  getGuess,
  createGuess,
  updateGuess,
  deleteGuess,
  processGuesses,
  registerGuesses
}

import uniq from 'lodash/fp/uniq'
import guessesModel from '../../models/guesses.model'
import { calculateGuessesPoints, parseRegisterGuesses } from './guesses.helpers'
import { sendProcessedGuessesEmail } from '../email/email.service'

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
  const { leagueId, championshipId } = req.body
  const guesses = await guessesModel.fetchAll({ leagueId, championshipId })

  const guessesUpdate = calculateGuessesPoints(guesses)
  const usersEmails = uniq(guesses.map(({ user }) => user.email))

  await guessesModel.replace(guessesUpdate)

  usersEmails.map((email) => sendProcessedGuessesEmail({ email }))
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

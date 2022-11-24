import uniq from 'lodash/fp/uniq'
import guessesModel from '../../models/guesses.model'
import championshipsGuessesModel from '../../models/championshipsGuesses.model'
import {
  calculateChampionshipsGuessesPoints,
  calculateGuessesPoints,
  parseDeleteChampionshipsGuesses,
  parseRegisterChampionshipsGuesses,
  parseRegisterMatchesGuesses
  // parseRegisterChampionshipsGuesses
} from './guesses.helpers'
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
  const { matchesGuesses, championshipsGuesses } = req.body
  const userId = res.locals.jwt.user.id
  const parsedMatchesGuesses = parseRegisterMatchesGuesses({
    matchesGuesses,
    userId
  })

  if (parsedMatchesGuesses.length > 0) {
    await guessesModel.replace(parsedMatchesGuesses)
  }

  const championshipGuessesToDelete =
    parseDeleteChampionshipsGuesses(championshipsGuesses)

  if (championshipGuessesToDelete.length > 0) {
    await Promise.all(
      championshipGuessesToDelete.map(
        async ({ championshipId, leagueId, userId }) =>
          await championshipsGuessesModel.delete({
            championshipId,
            leagueId,
            userId
          })
      )
    )
  }

  const parsedChampionshipsGuesses =
    parseRegisterChampionshipsGuesses(championshipsGuesses)

  if (parsedChampionshipsGuesses.length > 0) {
    await championshipsGuessesModel.replace(
      parsedChampionshipsGuesses.filter(({ teamId }) => teamId)
    )
  }

  return res.sendStatus(201)
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
  const matchesGuesses = await guessesModel.fetchAll({
    leagueId,
    championshipId
  })

  const championshipsGuesses = await championshipsGuessesModel.fetchAll({
    leagueId,
    championshipId
  })

  const matchesGuessesUpdate = calculateGuessesPoints(matchesGuesses)
  const championshipsGuessesUpdate =
    calculateChampionshipsGuessesPoints(championshipsGuesses)

  // return res.json({ championshipsGuesses, championshipsGuessesUpdate })
  if (matchesGuessesUpdate.length > 0) {
    await guessesModel.replace(matchesGuessesUpdate)
  }

  if (championshipsGuessesUpdate.length > 0) {
    await championshipsGuessesModel.replace(championshipsGuessesUpdate)
  }

  const usersEmails = uniq(
    [...matchesGuesses, ...championshipsGuesses].map(({ user }) => user.email)
  )

  Promise.all(
    usersEmails.map(async (email) => await sendProcessedGuessesEmail({ email }))
  ).catch((error) => console.log('Error trying to send e-mails', error))

  return res.sendStatus(200)
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

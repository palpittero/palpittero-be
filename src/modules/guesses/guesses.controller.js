import uniq from 'lodash/fp/uniq'
import intersection from 'lodash/fp/intersection'
import guessesModel from '../../models/guesses.model'
import championshipsGuessesModel from '../../models/championshipsGuesses.model'
import championshipsModel from '../../models/championships.model'
import {
  calculateChampionshipsGuessesPoints,
  calculateGuessesPoints,
  parseCopyChampionshipsGuesses,
  parseCopyMatchesGuesses,
  parseDeleteChampionshipsGuesses,
  parseRegisterChampionshipsGuesses,
  parseRegisterMatchesGuesses
  // parseRegisterChampionshipsGuesses
} from './guesses.helpers'
import { sendProcessedGuessesEmail } from '../email/email.service'
import matchesModel from '../../models/matches.model'
import { parseMatchesStatuses } from '../matches/matches.helpers'

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

  const matchesIds = uniq(matchesGuesses.map(({ matchId }) => matchId))

  const matches = await matchesModel.fetchAll({ ids: matchesIds })
  const matchesStatuses = parseMatchesStatuses(matches)

  const { validGuesses, invalidGuesses } = parseRegisterMatchesGuesses({
    matchesGuesses,
    userId,
    matchesStatuses
  })

  if (validGuesses.length > 0) {
    await guessesModel.replace(validGuesses)
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

  console.log({ parsedChampionshipsGuesses })

  if (parsedChampionshipsGuesses.length > 0) {
    await championshipsGuessesModel.replace(parsedChampionshipsGuesses)
  }

  return res.json({
    data: {
      invalidGuesses: invalidGuesses.length
    }
  })
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

const copyGuesses = async (req, res) => {
  const userId = res.locals.jwt.user.id
  const {
    sourceLeagueId,
    targetLeagueId,
    championshipsIds,
    copyMatchesGuesses,
    copyChampionshipsGuesses
  } = req.body
  let total = 0

  const targetLeagueChampionshipsIds = (
    await championshipsModel.fetchByLeague({
      leagueId: targetLeagueId
    })
  ).map(({ id }) => id)

  const commonChampionshipsIds = intersection(
    targetLeagueChampionshipsIds,
    championshipsIds
  )

  if (copyMatchesGuesses) {
    const userMatchesGuesses =
      await guessesModel.fetchByUserLeagueChampionships({
        userId,
        leagueId: sourceLeagueId,
        championshipsIds: commonChampionshipsIds
      })

    const matchesGuesses = parseCopyMatchesGuesses({
      matchesGuesses: userMatchesGuesses,
      targetLeagueId
    })

    if (matchesGuesses.length > 0) {
      await guessesModel.replace(matchesGuesses)
    }

    total += matchesGuesses.length
  }

  if (copyChampionshipsGuesses) {
    const userChampionshipsGuesses =
      await championshipsGuessesModel.fetchByUserLeagueChampionships({
        userId,
        leagueId: sourceLeagueId,
        championshipsIds: commonChampionshipsIds
      })

    const championshipsGuesses = parseCopyChampionshipsGuesses({
      championshipsGuesses: userChampionshipsGuesses,
      targetLeagueId
    })

    if (championshipsGuesses.length > 0) {
      await championshipsGuessesModel.replace(championshipsGuesses)
    }

    total += championshipsGuesses.length
  }

  return res.json({
    data: {
      total
    }
  })
}

export {
  getGuesses,
  getGuess,
  createGuess,
  updateGuess,
  deleteGuess,
  processGuesses,
  registerGuesses,
  copyGuesses
}

import championshipsGuessesModel from '../../models/championshipsGuesses.model'
import { parseChampionshipGuesses } from './championshipsGuesses.helpers'

const getChampionshipsGuesses = async (req, res) => {
  const { championshipId, leagueId } = req.params
  const { userId } = req.query

  const championshipsGuesses = await championshipsGuessesModel.fetchAll({
    userId,
    championshipId,
    leagueId
  })

  res.json({
    data: championshipsGuesses
  })
}

const getChampionshipGuess = async (req, res) => {
  const { id } = req.params

  const championshipGuess = await championshipsGuessesModel.fetchById(id)

  res.json({
    data: championshipGuess
  })
}

const createChampionshipGuesses = async (req, res) => {
  const { championshipId, leagueId, userId } = req.params
  const championshipsGuesses = parseChampionshipGuesses(
    req.body.championshipsGuesses,
    { championshipId, leagueId, userId }
  )

  await championshipsGuessesModel.delete({ championshipId, leagueId, userId })

  if (championshipsGuesses.length > 0) {
    await championshipsGuessesModel.replace(championshipsGuesses)
  }

  return res.sendStatus(201)
}

const deleteLeagueUserChampionshipGuesses = async (req, res) => {
  const { championshipId, leagueId, userId } = req.params

  await championshipsGuessesModel.delete({ championshipId, leagueId, userId })

  return res.sentStatus(204)
}

export {
  getChampionshipsGuesses,
  getChampionshipGuess,
  createChampionshipGuesses,
  deleteLeagueUserChampionshipGuesses
}

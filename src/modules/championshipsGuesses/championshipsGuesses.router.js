import { Router } from 'express'
import {
  getChampionshipsGuesses,
  getChampionshipGuess,
  createChampionshipGuesses,
  // updateChampionshipGuesses,
  deleteLeagueUserChampionshipGuesses
} from './championshipsGuesses.controller'

const router = Router()

router.get('/:championshipId/:leagueId', getChampionshipsGuesses)
router.get('/:id', getChampionshipGuess)
router.post('/:championshipId/:leagueId/:userId', createChampionshipGuesses)
router.delete(
  '/:championshipId/:leagueId/:userId',
  deleteLeagueUserChampionshipGuesses
)

export default router

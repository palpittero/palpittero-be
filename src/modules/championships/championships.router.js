import { Router } from 'express'
import {
  createChampionship,
  getChampionships,
  getChampionship,
  updateChampionship,
  deleteChampionship,
  getChampionshipRounds,
  getChampionshipTeams,
  deleteChampionships
} from './championships.controller'

const router = Router()

router.get('/', getChampionships)
router.get('/:id', getChampionship)
router.get('/:id/rounds', getChampionshipRounds)
router.get('/:id/teams', getChampionshipTeams)
router.post('/', createChampionship)
router.put('/:id', updateChampionship)
router.delete('/:id', deleteChampionship)
router.post('/delete-many', deleteChampionships)

export default router

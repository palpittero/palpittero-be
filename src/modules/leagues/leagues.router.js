import { Router } from 'express'
import {
  createLeague,
  getLeagues,
  getLeague,
  updateLeague,
  deleteLeague,
  getLeagueUsers,
  getLoggedUserLeagues,
  getPublicLeagues,
  getLeagueChampionships,
  deleteLeagues
} from './leagues.controller'

const router = Router()

router.get('/', getLeagues)
router.get('/my', getLoggedUserLeagues)
router.get('/public', getPublicLeagues)
router.get('/:id', getLeague)
router.get('/:id/users', getLeagueUsers)
router.get('/:id/championships', getLeagueChampionships)
router.post('/', createLeague)
router.put('/:id', updateLeague)
router.delete('/:id', deleteLeague)
router.post('/delete-many', deleteLeagues)

export default router

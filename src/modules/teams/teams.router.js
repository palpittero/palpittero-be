import { Router } from 'express'
import {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  deleteTeams
} from './teams.controller'

const router = Router()

router.get('/', getTeams)
router.get('/:id', getTeam)
router.post('/', createTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)
router.post('/delete-many', deleteTeams)

export default router

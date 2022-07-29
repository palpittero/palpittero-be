import { Router } from 'express'
import {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam
} from './teams.controller'

const router = Router()

router.get('/', getTeams)
router.get('/:id', getTeam)
router.post('/', createTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)

export default router

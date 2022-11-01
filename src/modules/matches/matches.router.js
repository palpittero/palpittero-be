import { Router } from 'express'
import {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  deleteMatches,
  createMatches
} from './matches.controller'

const router = Router()

router.get('/', getMatches)
router.get('/:id', getMatch)
router.post('/', createMatch)
router.post('/create-many', createMatches)
router.put('/:id', updateMatch)
router.delete('/:id', deleteMatch)
router.post('/delete-many', deleteMatches)

export default router

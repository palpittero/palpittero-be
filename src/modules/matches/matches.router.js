import { Router } from 'express'
import {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch
} from './matches.controller'

const router = Router()

router.get('/', getMatches)
router.get('/:id', getMatch)
router.post('/', createMatch)
router.put('/:id', updateMatch)
router.delete('/:id', deleteMatch)

export default router

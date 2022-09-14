import { Router } from 'express'
import { getGeneralStats, getUnprocessedGuesses } from './dashboard.controller'

const router = Router()

router.get('/general-stats', getGeneralStats)
router.get('/unprocessed-guesses', getUnprocessedGuesses)

export default router

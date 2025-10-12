import multer from 'multer'
import { storage } from '../../config/cloudinary'
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

import { updateStatus } from '../common/common.controller'
import leaguesModel from '../../models/leagues.model'

const router = Router()

const upload = multer({ storage })

router.get('/', getLeagues)
router.get('/my', getLoggedUserLeagues)
router.get('/public', getPublicLeagues)
router.get('/:id', getLeague)
router.get('/:id/users', getLeagueUsers)
router.get('/:id/championships', getLeagueChampionships)
router.post('/', upload.single('badge'), createLeague)
router.put('/:id', upload.single('badge'), updateLeague)
router.put('/:id/status', (req, res) => updateStatus(req, res, leaguesModel))
router.delete('/:id', deleteLeague)
router.post('/delete-many', deleteLeagues)

export default router

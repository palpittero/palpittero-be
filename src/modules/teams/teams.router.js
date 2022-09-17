import multer from 'multer'
import { storage } from '../../config/cloudinary'
import { Router } from 'express'
import {
  createTeam,
  getTeams,
  getCountries,
  getTeam,
  updateTeam,
  deleteTeam,
  deleteTeams
} from './teams.controller'

const router = Router()
const upload = multer({ storage })

router.get('/', getTeams)
router.get('/countries', getCountries)
router.get('/:id', getTeam)
router.post('/', upload.single('badge'), createTeam)
router.put('/:id', upload.single('badge'), updateTeam)
router.delete('/:id', deleteTeam)
router.post('/delete-many', deleteTeams)

export default router

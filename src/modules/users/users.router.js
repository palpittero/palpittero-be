import multer from 'multer'
import { storage } from '../../config/cloudinary'
import { Router } from 'express'
import {
  createUser,
  getUsers,
  getUser,
  // getUserLeagues,
  updateUser,
  deleteUser,
  deleteUsers
} from './users.controller'

import { updateStatus } from '../common/common.controller'
import usersModel from '../../models/users.model'

const upload = multer({ storage })

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUser)
// router.get('/:id/leagues', getUserLeagues)
router.post('/', createUser)
router.put('/:id', upload.single('avatar'), updateUser)
router.put('/:id/status', (req, res) => updateStatus(req, res, usersModel))
router.delete('/:id', deleteUser)
router.post('/delete-many', deleteUsers)

export default router

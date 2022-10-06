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

const upload = multer({ storage })

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUser)
// router.get('/:id/leagues', getUserLeagues)
router.post('/', createUser)
router.put('/:id', upload.single('avatar'), updateUser)
router.delete('/:id', deleteUser)
router.post('/delete-many', deleteUsers)

export default router

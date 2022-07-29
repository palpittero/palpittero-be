import { Router } from 'express'
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserLeagues
} from './users.controller'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.get('/:id/leagues', getUserLeagues)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router

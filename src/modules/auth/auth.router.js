import { Router } from 'express'
import { validateAccessToken } from '../../middleware/jwt.middleware'
import {
  authenticate,
  getLoggedUser,
  refreshToken,
  updatePassword,
  recoverPassword,
  signUp
} from './auth.controller'

const router = Router()

router.post('/authenticate', authenticate)
router.post('/signUp', signUp)
router.post('/recoverPassword', recoverPassword)
router.post('/refreshToken', validateAccessToken, refreshToken)
router.post('/updatePassword', validateAccessToken, updatePassword)
router.get('/me', validateAccessToken, getLoggedUser)

export default router

import { Router } from 'express'
import { validateAccessToken } from '../../middleware/jwt.middleware'
import {
  authenticate,
  getLoggedUser,
  refreshToken,
  updatePassword,
  recoverPassword,
  resetPassword,
  signUp,
  activateAccount,
  validate as validateToken
} from './auth.controller'

const router = Router()

router.post('/authenticate', authenticate)
router.post('/signUp', signUp)
router.post('/activate/:token', activateAccount)
router.get('/validateToken/:token', validateToken)
router.post('/recoverPassword', recoverPassword)
router.put('/resetPassword', resetPassword)
router.post('/refreshToken', validateAccessToken, refreshToken)
router.post('/updatePassword', validateAccessToken, updatePassword)
router.get('/me', validateAccessToken, getLoggedUser)

export default router

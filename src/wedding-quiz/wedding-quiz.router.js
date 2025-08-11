import { Router } from 'express'

import {
  login,
  // magicLogin,
  // magicLogout,
  me
} from './wedding-quiz.controller'

const router = Router()

router.get('/', (req, res) => res.status(200).json({ status: 'online' }))
router.post('/auth/login', login)
// router.post('/auth/magic-login', magicLogin)
// router.post('/auth/magic-logout', magicLogout)
router.get('/auth/me', me)

export default router

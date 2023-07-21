import { Router } from 'express'

import { login, logout, me } from './wedding-quiz.controller.js'

const router = Router()

router.get('/', (req, res) => res.status(200).json({ status: 'online' }))
router.post('/auth/login', login)
router.post('/auth/logout', logout)
router.get('/auth/me', me)

export default router

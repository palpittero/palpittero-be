import { Router } from 'express'

import { login, logout } from './wedding-quiz.controller.js'

const router = Router()

router.get('/', (req, res) => res.status(200).json({ status: 'online' }))
router.post('/auth/login', login)
router.post('/auth/logout', logout)

export default router

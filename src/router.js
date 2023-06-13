import { Router } from 'express'
import auth from './modules/auth/auth.router.js'
import users from './modules/users/users.router'
import leagues from './modules/leagues/leagues.router'
import matches from './modules/matches/matches.router'
import teams from './modules/teams/teams.router'
import guesses from './modules/guesses/guesses.router'
import usersLeagues from './modules/usersLeagues/usersLeagues.router'
import championships from './modules/championships/championships.router'
import dashboard from './modules/dashboard/dashboard.router'
import championshipsGuesses from './modules/championshipsGuesses/championshipsGuesses.router'
import alattus from './alattus/alattus.router'
import weddingQuiz from './wedding-quiz/wedding-quiz.router.js'

import {
  validateAccessToken,
  validateAlattusToken
} from './middleware/jwt.middleware'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).send({
    title: process.env.APP_TITLE,
    version: process.env.APP_VERSION
  })
})

router.use('/auth', auth)
router.use('/users', validateAccessToken, users)
router.use('/teams', validateAccessToken, teams)
router.use('/leagues', validateAccessToken, leagues)
router.use('/matches', validateAccessToken, matches)
router.use('/guesses', validateAccessToken, guesses)
router.use('/users-leagues', validateAccessToken, usersLeagues)
router.use('/championships', validateAccessToken, championships)
router.use('/dashboard', validateAccessToken, dashboard)
router.use('/championships-guesses', validateAccessToken, championshipsGuesses)

router.use('/alattus', validateAlattusToken, alattus)
router.use('/wedding-quiz', weddingQuiz)

export default router

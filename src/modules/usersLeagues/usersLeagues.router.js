import { Router } from 'express'
import {
  inviteUsers,
  acceptInvitation,
  deleteUser
} from './usersLeagues.controller'

const router = Router()

router.post('/invite', inviteUsers)
router.post('/acceptInvitation/:token', acceptInvitation)
router.delete('/:leagueId/:userId', deleteUser)

export default router

import { Router } from 'express'
import {
  inviteUsers,
  acceptInvitation,
  joinLeague,
  updateInvitations,
  deleteUser,
  approveUsers
} from './usersLeagues.controller'

const router = Router()

router.post('/invite', inviteUsers)
router.post('/acceptInvitation/:token', acceptInvitation)
router.post('/updateInvitations', updateInvitations)
router.delete('/:leagueId/:userId', deleteUser)
router.post('/join/:leagueId', joinLeague)
router.post('/approveUsers/:leagueId', approveUsers)

export default router

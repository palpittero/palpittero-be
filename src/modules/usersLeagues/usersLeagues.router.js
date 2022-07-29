import { Router } from 'express'
import { inviteUsers, approveUser, deleteUser } from './usersLeagues.controller'

const router = Router()

router.post('/invite', inviteUsers)
router.post('/approve', approveUser)
router.delete('/:leagueId/:userId', deleteUser)

export default router

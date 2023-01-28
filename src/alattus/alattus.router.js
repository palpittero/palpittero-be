import { Router } from 'express'

import {
  subscribeNewsletter,
  sendContact,
  subscribeToFinancialSheet,
  subscribeToInvestmentSheet,
  subscribeToMentorship,
  // validateCoupon,
  subscribeToLiveGuide,
  subscribeToWaitingList,
  subscribeToFinancialCleaning
} from './alattus.controller'

const router = Router()

router.get('/', (req, res) => res.status(200).json({ status: 'online' }))
router.post('/contact', sendContact)
router.post('/newsletter', subscribeNewsletter)

router.post('/subscribe/financial', subscribeToFinancialSheet)
router.post('/subscribe/investment', subscribeToInvestmentSheet)
router.post('/subscribe/mentorship', subscribeToMentorship)
router.post('/subscribe/liveGuide', subscribeToLiveGuide)
router.post('/subscribe/waitingList', subscribeToWaitingList)
router.post('/subscribe/cleaning', subscribeToFinancialCleaning)

export default router

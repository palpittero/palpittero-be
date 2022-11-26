import { Router } from 'express'
import {
  getGuesses,
  getGuess,
  createGuess,
  updateGuess,
  deleteGuess,
  processGuesses,
  registerGuesses,
  copyGuesses
} from './guesses.controller'

const router = Router()

router.get('/', getGuesses)
router.get('/my', (req, res) =>
  getGuesses(
    {
      ...req,
      query: {
        ...req.query,
        userId: res.locals.jwt.user.id
      }
    },
    res
  )
)
router.get('/:id', getGuess)
router.post('/', createGuess)
router.put('/:id', updateGuess)
router.delete('/:id', deleteGuess)
router.post('/process', processGuesses)
router.post('/register', registerGuesses)
router.post('/copy', copyGuesses)

export default router

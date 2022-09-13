import usersModel from '../../models/users.model'
import { validateToken } from '../../shared/token.service'

const validate = async (req, res) => {
  const { token } = req.params
  const secret = process.env.AUTH_TOKEN_SECRET

  const tokenValidation = validateToken({ token, secret })

  if (!tokenValidation) {
    return res.sendStatus(422)
  }

  const { email } = tokenValidation

  const user = await usersModel.fetchByEmail(email)

  if (!user) {
    return res.sendStatus(404)
  }

  return res.sendStatus(200)
}

export { validate }

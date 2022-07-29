import omit from 'lodash/fp/omit'
import jwt from 'jsonwebtoken'

const generateTokens = (user) => {
  const payload = omit('password', user)

  const accessToken = jwt.sign(
    { user: payload },
    process.env.AUTH_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN
    }
  )

  const refreshToken = jwt.sign(
    { user: payload },
    process.env.AUTH_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN
    }
  )

  return {
    accessToken,
    refreshToken
  }
}

export { generateTokens }

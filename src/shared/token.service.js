import jwt from 'jsonwebtoken'

const validateAuthenticatedToken = ({ token, secret, user }) => {
  try {
    const verification = jwt.verify(token, secret)

    return verification.email === user.email && verification
  } catch (err) {
    console.log('Authenticated Token error:', err)
    return false
  }
}

const validateAnonymousToken = ({ token, secret }) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    console.log('Anonymous Token error:', err)
    return false
  }
}

export { validateAuthenticatedToken, validateAnonymousToken }

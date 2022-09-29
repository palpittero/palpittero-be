import jwt from 'jsonwebtoken'

const validateToken = ({ token, secret }) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    console.log('Token error:', err)
    return false
  }
}

export { validateToken }

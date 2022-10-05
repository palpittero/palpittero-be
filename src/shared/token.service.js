import jwt from 'jsonwebtoken'

const validateToken = ({ token, secret, user }) => {
  try {
    const verification = jwt.verify(token, secret)
    // console.log({ email })

    return verification.email === user.email && verification
  } catch (err) {
    console.log('Token error:', err)
    return false
  }
}

export { validateToken }

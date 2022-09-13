import jwt from 'jsonwebtoken'

const validateToken = ({ token, secret }) => {
  console.log({ token, secret })
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    console.log(err)
    return false
  }
}

export { validateToken }

import jwt from 'jsonwebtoken'
import magic from '../shared/magic.service'
import { createGuest, guestExists } from './wedding-quiz.service'

const login = async (req, res) => {
  try {
    const {
      didToken,
      guest: { email, name }
    } = req.body
    // console.log({ didToken, guest })
    await magic.token.validate(didToken)
    const magicUserMetadata = await magic.users.getMetadataByToken(didToken)
    // console.log({ magicUserMetadata })

    const token = jwt.sign(
      {
        ...magicUserMetadata,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': `${magicUserMetadata.issuer}`
          // 'x-hasura-user-id':
          //   'did:ethr:0xFC6C7E08782044471ab9A95549A2C7804fddc324'
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
      },
      process.env.WEDDING_QUIZ_JWT_SECRET
    )

    if (!(await guestExists(didToken, token))) {
      await createGuest({ name, email })
    }
    // if (!(await guestExists("magicUserMetadata.issuer", token))) {
    //   await createGuest(magicUserMetadata, token)
    // }

    return res.json(token)
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
}

const logout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ message: 'User is not logged in' })
    }

    const { token } = req.cookies
    const magicUser = jwt.verify(token, process.env.JWT_SECRET)
    console.log({ magicUser })
    res.clearCookie('token')

    // Add the try/catch because a user's session may have already expired with Magic (expired 7 days after login)
    try {
      await magic.users.logoutByIssuer(magicUser.issuer)
    } catch (error) {
      console.log('Users session with Magic already expired')
    }
    // res.writeHead(302, { Location: '/login' })
    return res.json()
  } catch (error) {
    return res.status(401).json({ message: 'User is not logged in' })
  }
}

export { login, logout }

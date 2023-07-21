import jwt from 'jsonwebtoken'
import omit from 'lodash/fp/omit'
import magic from '../shared/magic.service'
import {
  findUser,
  createUser,
  // linkGuestToUser,
  setUserIssuer,
  findGuests,
  linkGuestsToUser
} from './wedding-quiz.service'

const login = async (req, res) => {
  try {
    const {
      didToken,
      credentials: { type, value }
    } = req.body
    // console.log(req.body)
    await magic.token.validate(didToken)
    const magicUserMetadata = await magic.users.getMetadataByToken(didToken)

    const user =
      (await findUser({ issuer: didToken, credential: value })) ||
      (await createUser({ [type]: value, issuer: didToken }))

    if (!user.issuer) {
      await setUserIssuer({ issuer: didToken, id: user.id })
    }

    const guests = await findGuests({ credential: value, userId: user.id })
    const guestsIds = guests.map(({ id }) => id).join(',')

    await linkGuestsToUser({ guestsIds, userId: user.id })

    const token = jwt.sign(
      {
        user: {
          ...user,
          magic: magicUserMetadata
        },
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

    return res.json({
      token,
      user
    })
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

const me = async (req, res) => {
  const { authorization } = req.headers

  try {
    const {
      user: { issuer, email, phone }
    } = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.WEDDING_QUIZ_JWT_SECRET
    )

    const user = await findUser({ issuer, credential: email || phone })

    if (!user) {
      return res.sendStatus(401)
    }

    return res.json(omit('issuer', user))
  } catch (error) {
    return res.sendStatus(401)
  }
}

export { login, logout, me }

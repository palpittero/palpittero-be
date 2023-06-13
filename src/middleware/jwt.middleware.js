import jwt from 'jsonwebtoken'

const validateRefreshToken = (req, res, next) => {
  if (req.body?.refreshToken) {
    return next()
  } else {
    return res.status(400).send({ errors: ['Refresh token is required'] })
  }
}

const validateAccessToken = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const { authorization } = req.headers

      if (!authorization.includes('Bearer')) {
        return res.sendStatus(401)
      } else {
        res.locals.jwt = jwt.verify(
          authorization.replace('Bearer ', ''),
          process.env.AUTH_ACCESS_TOKEN_SECRET
        )

        next()
      }
    } catch (err) {
      return res.sendStatus(401)
    }
  } else {
    return res.sendStatus(401)
  }
}

const validateAlattusToken = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const { authorization } = req.headers

      if (!authorization.includes(process.env.ALATTUS_ACCESS_TOKEN)) {
        return res.sendStatus(401)
      } else {
        next()
      }
    } catch (err) {
      return res.sendStatus(401)
    }
  } else {
    return res.sendStatus(401)
  }
}

export { validateRefreshToken, validateAccessToken, validateAlattusToken }

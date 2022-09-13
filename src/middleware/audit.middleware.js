const audit = (req, res, next) => {
  console.log({
    // req,
    locals: res.locals?.jwt
  })
  next()
}

export { audit }

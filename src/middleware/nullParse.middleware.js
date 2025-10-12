export const nullParse = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === 'null') {
      req.body[key] = null
    }
    if (req.body[key] === 'undefined') {
      req.body[key] = undefined
    }
  }
  next()
}

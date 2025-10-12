const getAppRoute = (resource = '', params = {}) => {
  const url = `${process.env.APP_URL}${resource}`
  const queryString = new URLSearchParams(params).toString()

  return `${url}?${queryString}`
}

const safeJSONParse = (value) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

const parseFile = ({ req, key }) => {
  const file = req.file?.path ? req.file?.path : req.body[key]

  return file !== 'null' ? file : null
}

export { getAppRoute, safeJSONParse, parseFile }

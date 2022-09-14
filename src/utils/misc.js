const getApiURL = (resource = '') => `${process.env.API_URL}${resource}`

const getAppRoute = (resource = '', params) => {
  const url = `${process.env.APP_URL}${resource}`
  const queryString = new URLSearchParams(params).toString()

  return `${url}?${queryString}`
}

export { getApiURL, getAppRoute }

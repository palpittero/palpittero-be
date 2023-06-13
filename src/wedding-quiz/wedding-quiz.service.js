import axios from 'axios'

const guestExists = async (issuer, token) => {
  const query = {
    query: `{
      guests( where: {issuer: {_eq: "${issuer}"}}) {
        email
      }
    }`
  }
  const { users } = await queryHasura(query, token)
  // console.log({ exists: result.data })

  return users?.length > 0
}

async function createGuest({ email, issuer }) {
  const query = {
    query: `mutation {
      insert_guests_one( object: { email: "${email}", issuer: "${issuer}" }) {
        email
      }
    }`
  }

  return await queryHasura(query)
}

const queryHasura = async (query) => {
  const { data } = await axios.post(
    process.env.WEDDING_QUIZ_HASURA_GRAPHQL_URL,
    JSON.stringify(query),
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-hasura-admin-secret': process.env.WEDDING_QUIZ_HASURA_ADMIN_SECRET
      }
      // data
      // body: JSON.stringify(query)
    }
  )

  // console.log('data', JSON.stringify())
  // console.log({ res: JSON.stringify(res) })
  // const json = await res.json()
  // console.log({ json })
  return data
}

export { guestExists, createGuest }

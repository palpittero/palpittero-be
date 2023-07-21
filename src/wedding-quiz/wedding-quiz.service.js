import axios from 'axios'

const findUser = async ({ issuer, credential }) => {
  const query = {
    query: `query {
      users(where: { _or: [{ issuer: {_eq: "${issuer}" }}, {email: { _eq: "${credential}" }}, {phone: { _eq: "${credential}" }} ]}) {
        id
        name
        email
        phone
        issuer
      }
    }`
  }

  console.log('find user', query)

  const {
    data: { users }
  } = await queryHasura(query)

  return users[0]
}

const findGuests = async ({ credential, userId }) => {
  const query = {
    query: `query {
      guests(where: { _or: [{ email: { _eq: "${credential}" }}, {phone: { _eq: "${credential}" }}, {user_id: { _eq: ${userId} }}]  }) {
        id
        email
        phone
        user_id
        status
        event {
          id
          name
          datetime
        }
      }
    }`
  }

  console.log('find query', query)

  const {
    data: { guests }
  } = await queryHasura(query)

  return guests
}

async function createUser({ email = '', phone = '', issuer }) {
  const query = {
    query: `mutation {
      insert_users_one( object: { name: "", email: "${email}", phone: "${phone}", issuer: "${issuer}" }) {
        id
        name
        email
        phone
        issuer
      }
    }`
  }

  const {
    data: { insert_users_one }
  } = await queryHasura(query)

  // console.log('createUser', { data, query })

  return insert_users_one
}

async function setUserIssuer({ issuer, id }) {
  const query = {
    query: `mutation {
      update_users_by_pk(pk_columns: {id: ${id}}, _set: { issuer: ${issuer}) {
        id
        name
        email
        phone
        issuer
      }
    }`
  }

  return await queryHasura(query)
}

async function linkGuestToUser({ guestId, userId }) {
  const query = {
    query: `mutation {
      update_guests_by_pk(pk_columns: {id: ${guestId}}, _set: { user_id: ${userId} }) {
        id
        email
        name
        user_id
      }
    }`
  }

  return await queryHasura(query)
}

async function linkGuestsToUser({ guestsIds, userId }) {
  const query = {
    query: `mutation {
      update_guests_many(updates: { _set: { user_id: ${userId} }, where:{ id: { _in : [${guestsIds}] } } }) {
        returning {
          id
          name
          email
          phone
          status
          user_id
        }
      }
    }`
  }

  console.log('link guests', query)

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

export {
  findUser,
  findGuests,
  createUser,
  setUserIssuer,
  linkGuestToUser,
  linkGuestsToUser
}

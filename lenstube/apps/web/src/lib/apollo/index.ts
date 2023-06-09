import { ApolloClient, from, HttpLink } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { LENS_API_URL } from 'utils'

import authLink from './authLink'
import cache from './cache'

const retryLink = new RetryLink({
  delay: {
    initial: 100
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error)
  }
})

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetchOptions: 'no-cors',
  fetch
})

const apolloClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache
})

export default apolloClient

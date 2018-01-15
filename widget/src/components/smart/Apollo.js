import React from 'react'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { BatchHttpLink } from "apollo-link-batch-http"
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { onFinish } from './AfterwareLink'

const uri = process.env.NODE_ENV === 'development' ? "http://localhost:3001/graphql/" : "https://api.bibletags.org/graphql/"

const batchHttpLink = new BatchHttpLink({ uri })
const cache = new InMemoryCache()

export const restoreCache = () => {
  try {
    cache.restore(JSON.parse(localStorage.getItem('apolloCache') || "{}"))
    console.log('cache restored')
  } catch(e) {
    console.log('could not restore cache', e)
  }
}

// const middleware = new ApolloLink((operation, forward) => {
//   console.log('middleware', operation, forward)
//   return forward(operation)
// })

const localStorageAfterware = onFinish(({ networkError, graphQLErrors, response, operation }) => {
  setTimeout(() => {
    try {
      localStorage.setItem('apolloCache', JSON.stringify(cache.extract()))
      console.log('cache saved to localStorage')
    } catch(e) {
      console.log('could not save cache to localStorage', e)
    }
  })
})

const client = new ApolloClient({
  link: from([
    // middleware,
    localStorageAfterware,
    batchHttpLink,
  ]),
  cache,
})

class Apollo extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    )
  }
}

export default Apollo
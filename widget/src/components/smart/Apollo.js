import React from 'react'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { BatchHttpLink } from "apollo-link-batch-http"
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import lzutf8 from 'lzutf8'

import { onFinish } from './AfterwareLink'

const URI = process.env.NODE_ENV === 'development' ? "http://localhost:3001/graphql/" : "https://api.bibletags.org/graphql/"
const MAX_CACHE_KEYS = 500

const batchHttpLink = new BatchHttpLink({ uri: URI })
const cache = new InMemoryCache()

export const restoreCache = () => {
  try {
    const cacheObj = JSON.parse(lzutf8.decompress(localStorage.getItem('apolloCache') || "{}", { inputEncoding: "BinaryString" }))
    cache.restore(cacheObj)
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
      const cacheObj = cache.extract()
      let cacheIndex = parseInt(localStorage.getItem('apolloCacheIndex') || 1)
      for(let key in cacheObj) {
        const cacheValue = cacheObj[key]
        if(key === 'ROOT_QUERY') {
          
        } else if(cacheValue.__i && cacheValue.__i < cacheIndex - MAX_CACHE_KEYS) {
          delete cacheObj[key]
          // TODO: delete the cooresponding key in ROOT_QUERY
        } else if(!cacheValue.__i) {
          cacheValue.__i = cacheIndex++
        }
      }

      localStorage.setItem('apolloCache', lzutf8.compress(JSON.stringify(cacheObj), { outputEncoding: "BinaryString" }))
      localStorage.setItem('apolloCacheIndex', cacheIndex)
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
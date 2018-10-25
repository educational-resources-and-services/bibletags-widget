import React from 'react'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { BatchHttpLink } from "apollo-link-batch-http"
import { from } from 'apollo-link'
// import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import lzutf8 from 'lzutf8'

import { onFinish } from './AfterwareLink'

const hashParamObject = {}
window.location.hash
  .split('#')
  .slice(1)
  .join('#')
  .split('&')
  .forEach(arg => {
    const argParts = arg.split('=');
    hashParamObject[argParts[0]] = argParts[1];
  });

const URI = hashParamObject.data === 'local'
  ? "http://localhost:3001/graphql/"
  : (
    hashParamObject.data === 'staging'
      ? "https://api.staging.bibletags.org/graphql/"
      : "https://api.bibletags.org/graphql/"
  )
const MAX_CACHE_KEYS = 500

const batchHttpLink = new BatchHttpLink({ uri: URI })
const cache = new InMemoryCache()
let lastCacheUpdate = -1

const getCacheFromLocalStorage = () => {
  if(lastCacheUpdate === parseInt(localStorage.getItem('apolloCacheLastUpdateTime') || 0, 10)) {
    // this widget instance was the last to update the cache, so no need to get it
    return null
  }
  const apolloCache = localStorage.getItem('apolloCache')
  if(!apolloCache) return null
  return JSON.parse(lzutf8.decompress(apolloCache, { inputEncoding: "BinaryString" }))
}

export const restoreCache = () => {
  try {
    const localStorageCacheObj = getCacheFromLocalStorage()
    if(localStorageCacheObj) {
      cache.restore(localStorageCacheObj)
      lastCacheUpdate = parseInt(localStorage.getItem('apolloCacheLastUpdateTime') || 0, 10)
      console.log('cache restored')
    } else {
      // cache up-to-date or no cache available in localstorage
    }
  } catch(e) {
    console.log('could not restore cache', e)
  }
}

export const saveCache = () => {
  try {
    const localStorageCacheObj = getCacheFromLocalStorage() || {}
    const cacheObj = {
      ...localStorageCacheObj,
      ...cache.extract(),
    }
    cacheObj.ROOT_QUERY = {
      ...localStorageCacheObj.ROOT_QUERY,
      ...cacheObj.ROOT_QUERY,
    }
    let cacheIndex = parseInt(localStorage.getItem('apolloCacheIndex') || 1, 10)

    for(let key in cacheObj) {
      const cacheValue = cacheObj[key]
      if(key === 'ROOT_QUERY') {
        // do nothing
      } else if(cacheValue.__i && cacheValue.__i < cacheIndex - MAX_CACHE_KEYS) {
        delete cacheObj[key]
        // TODO: delete the cooresponding key in ROOT_QUERY
      } else if(!cacheValue.__i) {
        cacheValue.__i = cacheIndex++
      }
    }

    lastCacheUpdate = Date.now()
    localStorage.setItem('apolloCache', lzutf8.compress(JSON.stringify(cacheObj), { outputEncoding: "BinaryString" }))
    localStorage.setItem('apolloCacheIndex', cacheIndex)
    localStorage.setItem('apolloCacheLastUpdateTime', lastCacheUpdate)

    console.log('cache saved to localStorage')

  } catch(e) {
    console.log('could not save cache to localStorage', e)
  }
}
// const middleware = new ApolloLink((operation, forward) => {
//   console.log('middleware', operation, forward)
//   return forward(operation)
// })

const localStorageAfterware = onFinish(({ networkError, graphQLErrors, response, operation }) => {
  if(networkError) {
    // TODO: handle errors
    
  } else if(graphQLErrors) {
    // TODO: handle errors
     
  } else {
    setTimeout(saveCache)

  }
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
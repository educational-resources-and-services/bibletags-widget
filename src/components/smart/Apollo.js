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
const MAX_CACHE_KEYS = 10000  // ~2MB of localstorage

const batchHttpLink = new BatchHttpLink({ uri: URI })
const cache = new InMemoryCache()
let lastCacheUpdate = -1
let saveCacheKeys = []

const getCacheFromLocalStorage = () => {
  if(lastCacheUpdate === parseInt(localStorage.getItem('apolloCacheLastUpdateTime') || 0, 10)) {
    // this widget instance was the last to update the cache, so no need to get it
    return null
  }
  const apolloCache = localStorage.getItem('apolloCache')
  if(!apolloCache) return null
  return JSON.parse(lzutf8.decompress(apolloCache, { inputEncoding: "BinaryString" }))
}

const getCacheFromLocalStorageAndCurrentPage = returnFalseIfNothingNewFromLocalStorage => {
  let localStorageCacheObj = getCacheFromLocalStorage()

  if(returnFalseIfNothingNewFromLocalStorage && !localStorageCacheObj) return false
  
  localStorageCacheObj = localStorageCacheObj || {}

  const cacheObj = {
    ...localStorageCacheObj,
    ...cache.extract(),
  }

  cacheObj.ROOT_QUERY = {
    ...localStorageCacheObj.ROOT_QUERY,
    ...cacheObj.ROOT_QUERY,
  }

  return cacheObj
}

export const restoreCache = () => {
  try {
    const cacheObj = getCacheFromLocalStorageAndCurrentPage(true)
    if(cacheObj) {
      cache.restore(cacheObj)
      lastCacheUpdate = parseInt(localStorage.getItem('apolloCacheLastUpdateTime') || 0, 10)
      console.log('cache restored')
    } else {
      // cache up-to-date or no cache available in localstorage
    }
  } catch(e) {
    console.log('could not restore cache', e)
  }
}

export const saveCache = lastKeyQueried => {
  if(!saveCacheKeys.includes(lastKeyQueried)) {
    saveCacheKeys.push(lastKeyQueried)
  }
  
  setTimeout(() => {
    if(saveCacheKeys.length === 0) return

    try {
      const cacheObj = getCacheFromLocalStorageAndCurrentPage()
      let cacheIndex = parseInt(localStorage.getItem('apolloCacheIndex') || 1, 10)

      for(let key in cacheObj) {
        const cacheValue = cacheObj[key]
        if(key === 'ROOT_QUERY') {
          // do nothing
          
        } else if(!cacheValue.__i || saveCacheKeys.includes(key)) {
          cacheValue.__i = cacheIndex++

        } else if(cacheValue.__i < cacheIndex - MAX_CACHE_KEYS * 3) {
          // MAX_CACHE_KEYS is multiplied by 3 since repeated queries will cause frequent holes
          // in the cacheIndex sequence. This is, or course, a guesstimation since precisely enforcing
          // MAX_CACHE_KEYS would be too expensive in terms of processor. 

          delete cacheObj[key]
        }
      }

      for(let key in cacheObj.ROOT_QUERY) {
        if(cacheObj.ROOT_QUERY[key].id && !cacheObj[cacheObj.ROOT_QUERY[key].id]) {
          delete cacheObj.ROOT_QUERY[key]
        }
      }

      saveCacheKeys = []
  
      lastCacheUpdate = Date.now()
      localStorage.setItem('apolloCache', lzutf8.compress(JSON.stringify(cacheObj), { outputEncoding: "BinaryString" }))
      localStorage.setItem('apolloCacheIndex', cacheIndex)
      localStorage.setItem('apolloCacheLastUpdateTime', lastCacheUpdate)
  
      console.log('cache saved to localStorage')
  
    } catch(e) {
      console.log('could not save cache to localStorage', e)
    }
  }, 500)
}
// const middleware = new ApolloLink((operation, forward) => {
//   console.log('middleware', operation, forward)
//   return forward(operation)
// })

// const localStorageAfterware = onFinish(({ networkError, graphQLErrors, response, operation }) => {
//   if(networkError) {
//     // TODO: handle errors
    
//   } else if(graphQLErrors) {
//     // TODO: handle errors
     
//   } else {
//     // setTimeout(saveCache)

//   }
// })

export const client = new ApolloClient({
  link: from([
    // middleware,
    // localStorageAfterware,
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
import React from 'react'
// import styled from 'styled-components'
import { Query } from "react-apollo"
import { getQueryVars, getStaleState, setStaleTime, client } from './Apollo'

class SmartQuery extends React.Component {

  render() {
    const { queryVarSuffix, staleTime, cacheKey, children, ...queryProps } = this.props 

    let staleState = (staleTime && cacheKey)
      ? getStaleState(cacheKey)
      : 1  // i.e. no stale time to be set

    if(staleState === 0) {
      // It is going to get the value from the cache, but we also want to query the 
      // network for next time. Doing it this way instead of simply changing the fetchPolicy
      // to cache-and-network prevents it from indicating that it is still loading.
      client.query({
        ...queryProps,
        fetchPolicy: "network-only",
      })
    }

    return (
      <Query {...queryProps} >
        {queryInfo => {
          const queryVars = getQueryVars({ queryInfo, queryVarSuffix })
          const { error, loading } = queryInfo

          if(error) {
            // TODO: indicate to the user + report
            return null
          }

          if(!loading && staleState <= 0) {
            // There is no easy way to tell if this query result was retrieved from the cache or network
            // and thereby know when to set a new stale time. But it is generally not a big deal if we
            // extend the stale time in the event there was a failed network query.
            setStaleTime({ cacheKey, staleTime })
            staleState = 1
          }

          return children(queryVars)
        }}
      </Query>
    )
  }

}

export default SmartQuery
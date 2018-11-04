import React from 'react'
// import styled from 'styled-components'
import { Query } from "react-apollo"
import { getQueryVars, getStaleState, setStaleTime } from './Apollo'

class SmartQuery extends React.Component {

  render() {
    const { queryVarSuffix, staleTime, cacheKey, children, ...queryProps } = this.props 

    if(staleTime && cacheKey) {
      if(getStaleState(cacheKey)) {
        // By setting this before the query runs, I am ASSUMING the query will be successful. While
        // this is not ideal, we do it anyway because (1) there is no easy way to tell if a query
        // result was retrieved from the cache or network and thereby know when to set a new stale time,
        // and (2) it is generally not a big deal if we extend the stale time in the event there was a
        // failed network query.
        setStaleTime({ cacheKey, staleTime })

        queryProps.fetchPolicy = "cache-and-network"
      }
    }

    return (
      <Query {...queryProps} >
        {queryInfo => {
          const queryVars = getQueryVars({ queryInfo, queryVarSuffix })
          const { error } = queryInfo

          if(error) {
            // TODO: indicate to the user + report
            return null
          }

          return children(queryVars)
        }}
      </Query>
    )
  }

}

export default SmartQuery
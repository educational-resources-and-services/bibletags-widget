import React from 'react'
// import styled from 'styled-components'
import { Query } from "react-apollo"
import { getQueryVars } from './Apollo'

class SmartQuery extends React.Component {

  render() {
    const { query, variables, queryVarSuffix, children } = this.props 

    return (
      <Query
        query={query}
        variables={variables}
      >
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
import React from 'react'
import styled from 'styled-components'
import { Query } from "react-apollo"

import CircularProgress from '@material-ui/core/CircularProgress'

import { getQueryVars } from './Apollo'

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0;
`

class SmartQuery extends React.Component {

  render() {
    const { query, variables, queryVarSuffix, progressContainterStyle, children } = this.props 

    return (
      <Query
        query={query}
        variables={variables}
      >
        {queryInfo => {
          const queryVars = getQueryVars({ queryInfo, queryVarSuffix })
          const { loading, error } = queryVars

          if(loading) {
            return (
              <div>
                <CircularProgressCont style={progressContainterStyle}>
                  <CircularProgress />
                </CircularProgressCont>
              </div>
            )
          }

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
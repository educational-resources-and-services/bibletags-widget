import React from 'react'

import SmartQuery from './SmartQuery'

export class SmartQueries extends React.Component {

  render() {
    const { query, variableSets, variableKey='id', queryVarSets={}, children } = this.props

    if(variableSets.length === 0) {
      return children({
        queryVarSets,
        isAllLoaded: () => Object.values(queryVarSets).every(({ loading }) => !loading),
      })
    }
  
    const variableSet = variableSets[0]
  
    return (
      <SmartQuery
        query={query}
        variables={variableSet}
      >
        {queryVars => {
          queryVarSets[variableSet[variableKey]] = queryVars
          return (
            <SmartQueries
              query={query}
              variableSets={variableSets.slice(1)}
              variableKey={variableKey}
              queryVarSets={queryVarSets}
            >
              {children}
            </SmartQueries>
          )
        }}
      </SmartQuery>
    )
  }
}

export default SmartQueries
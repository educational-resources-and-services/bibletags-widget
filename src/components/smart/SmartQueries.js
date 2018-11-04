import React from 'react'

import SmartQuery from './SmartQuery'

export class SmartQueries extends React.Component {

  render() {
    const { querySets, variableKey='id', queryVarSets={}, children, ...queryProps } = this.props

    if(querySets.length === 0) {
      return children({
        queryVarSets,
        isAllLoaded: () => Object.values(queryVarSets).every(({ loading }) => !loading),
      })
    }

    return (
      <SmartQuery
        {...queryProps}
        {...querySets[0]}
      >
        {queryVars => {
          queryVarSets[querySets[0].variables[variableKey]] = queryVars
          return (
            <SmartQueries
              {...this.props}
              queryVarSets={queryVarSets}
              querySets={querySets.slice(1)}
            />
          )
        }}
      </SmartQuery>
    )
  }
}

export default SmartQueries
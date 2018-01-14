import React from 'react'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { BatchHttpLink } from "apollo-link-batch-http"
// import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'

const uri = process.env.NODE_ENV === 'development' ? "http://localhost:3001/graphql/" : "https://data.bibletags.org/graphql"

const client = new ApolloClient({
  link: new BatchHttpLink({ uri }),
  cache: new InMemoryCache(),
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
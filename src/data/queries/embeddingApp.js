import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  query ($uri: String!) {
    embeddingApp(uri: $uri) {
      id
    }
  }
`
import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    tagSet(id: $id) {
      id
      tags
    }
  }
`
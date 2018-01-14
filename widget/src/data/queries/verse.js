import gql from 'graphql-tag'

export default gql
`
  query ($id: ID!) {
    verse(id: $id) {
      id
      usfm
    }
  }
`
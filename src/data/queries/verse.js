import gql from 'graphql-tag'
import verse_fields from '../fragments/verse_fields'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    verse(id: $id) {
      ${verse_fields}
    }
  }
`
import gql from 'graphql-tag'
import tagSet_fields from '../fragments/tagSet_fields'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    tagSet(id: $id) {
      ${tagSet_fields}
    }
  }
`
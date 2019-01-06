import gql from 'graphql-tag'
import definition_fields from '../fragments/definition_fields'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    definition(id: $id) {
      ${definition_fields}
    }
  }
`
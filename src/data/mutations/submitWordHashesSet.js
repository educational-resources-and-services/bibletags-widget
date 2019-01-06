import gql from 'graphql-tag'
import tagSet_fields from '../fragments/tagSet_fields'

// eslint-disable-next-line
export default gql
`
  mutation ($input: WordHashesSetInput!) {
    submitWordHashesSet(input: $input) {
      ${tagSet_fields}
    }
  }
`
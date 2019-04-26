import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  mutation ($input: RequestLoginTokenInput!) {
    requestLoginToken(input: $input)
  }
`
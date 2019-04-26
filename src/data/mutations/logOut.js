import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  mutation ($input: LogOutInput!) {
    logOut(input: $input)
  }
`
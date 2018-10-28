import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    versionInfo(id: $id) {
      id
      name
      language
      wordDividerRegex
      partialScope
      versificationModel
      skipsUnlikelyOriginals
      extraVerseMappings
    }
  }
`
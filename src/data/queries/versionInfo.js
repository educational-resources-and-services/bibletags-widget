import gql from 'graphql-tag'

// eslint-disable-next-line
export default gql
`
  query ($id: ID!) {
    versionInfo(id: $id) {
      id
      name
      languageId
      wordDividerRegex
      partialScope
      versificationModel
      skipsUnlikelyOriginals
      extraVerseMappings
    }
  }
`
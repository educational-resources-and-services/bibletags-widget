import gql from 'graphql-tag'
import definition_fields from '../fragments/definition_fields'

// eslint-disable-next-line
export default gql
`
  query ($versionId: String!, $verseLoc: String!, $wordNum: Int!, $languageId: String!) {
    definitionsByPosition(versionId: $versionId, verseLoc: $verseLoc, wordNum: $wordNum, languageId: $languageId) {
      ${definition_fields}
    }
  }
`
import gql from 'graphql-tag'

export default gql
`
  query ($versionId: String!, $verseLoc: String!, $wordNum: Int!, $languageId: String!) {
    definitionsByPosition(versionId: $versionId, verseLoc: $verseLoc, wordNum: $wordNum, languageId: $languageId) {
      id
      lex
      lexUnique
      vocal
      hits
      gloss
      pos
      syn
      rel
      lxx
      lxxHits {
        id
        hits
      }
    }
  }
`
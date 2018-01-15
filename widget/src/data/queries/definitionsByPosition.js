import gql from 'graphql-tag'

export default gql
`
  query ($version: String!, $verseLoc: String!, $wordNum: Int!, $language: String!) {
    definitionsByPosition(version: $version, verseLoc: $verseLoc, wordNum: $wordNum, language: $language) {
      id
      lemma
      lemmaUnique
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
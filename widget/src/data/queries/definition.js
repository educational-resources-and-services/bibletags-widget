import gql from 'graphql-tag'

export default gql
`
  query ($id: ID!) {
    definition(id: $id) {
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
import gql from 'graphql-tag'

// eslint-disable-next-line
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
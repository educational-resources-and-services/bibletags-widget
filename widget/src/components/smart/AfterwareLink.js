// code modified from https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-error/src/index.ts

import { ApolloLink, Observable, Operation } from 'apollo-link'
import { GraphQLError, ExecutionResult } from 'graphql'

export const onFinish = handler => {
  return new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      let sub
      try {
        sub = forward(operation).subscribe({
          next: result => {
            if(result.errors) {
              handler({
                graphQLErrors: result.errors,
                response: result,
                operation,
              })
            } else {
              handler({
                response: result,
                operation,
              })
            }
            observer.next(result)
          },
          error: networkError => {
            handler({
              operation,
              networkError,
              //Network errors can return GraphQL errors on for example a 403
              graphQLErrors: networkError.result && networkError.result.errors,
            })
            observer.error(networkError)
          },
          complete: observer.complete.bind(observer),
        })
      } catch (e) {
        handler({ networkError: e, operation })
        observer.error(e)
      }

      return () => {
        if (sub) sub.unsubscribe()
      }
    })
  })
}
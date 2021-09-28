import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

/**
 * Exposed functions from GraphQLQuery run a basic request
 * against the GraphQL Storefront API using Apollo Client.
 * They return a Promise, loaded with the responce payload.
 */


export default class GraphQLQuery {
  #token;

  constructor(token){
    this.#token = token;
  }

  #queryFactory(taggedQuery, queryVariables) {
    const client = new ApolloClient({
      headers: { Authorization: `Bearer ${this.#token}` },
    });

    return client.query({
      query: taggedQuery,
      variables: queryVariables,
    })
  }

  runQuery(rawQuery, queryVariables) {
    return this.#queryFactory( gql(rawQuery), queryVariables )
  }

  getShelfProductData(productID) {
    return this.#queryFactory(
      gql`
        query productById($productId: Int!) {
          site {
            product(entityId: $productId) {
              entityId
              name
              availabilityV2 {
                status
                description
              }
              defaultImage {
                ...ImageFields
              }

              prices {
                price {
                  ...MoneyFields
                }
              }
            }
          }
        }

        fragment ImageFields on Image {
          url320wide: url(width: 320)
          url640wide: url(width: 640)
          url960wide: url(width: 960)
          url1280wide: url(width: 1280)
        }

        fragment MoneyFields on Money {
          value
          currencyCode
        }
      `,
      {
        "productId": Number(productID)
      }
    )
  }
}

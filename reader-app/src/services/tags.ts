import { graphql } from '@/gql'

export const TAG_QUERY = graphql(`
  query Categories {
    categories {
      id
      attributes {
        name {
          en
          pt_br
        }
        group
      }
    }
  }
`)

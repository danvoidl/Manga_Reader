export const mangaChaptersTypeDefs = /* GraphQL */ `
  type ChapterAttributes {
    volume: String
    chapter: String
    title: String
    translatedLanguage: String
    externalUrl: String
    publishAt: String
    readableAt: String
    createdAt: String
    updatedAt: String
    pages: Int
    version: Int
  }

  type ScanlationGroupAttributes {
    name: String
    altNames: [String]
    locked: Boolean
    website: String
    ircServer: String
    ircChannel: String
    discord: String
    contactEmail: String
    description: String
    twitter: String
    mangaUpdates: String
    focusedLanguages: [String]
    official: Boolean
    verified: Boolean
    inactive: Boolean
    publishDelay: String
    exLicensed: Boolean
    createdAt: String
    updatedAt: String
    version: Int
  }

  type UserAttributes {
    username: String
    roles: [String]
    version: Int
  }

  union RelationshipAttributes = ScanlationGroupAttributes | UserAttributes

  enum RelationshipType {
    scanlation_group
    manga
    user
  }

  type ChapterRelationship {
    id: ID!
    type: RelationshipType!
    attributes: RelationshipAttributes
  }

  type Chapter {
    id: ID!
    type: String
    attributes: ChapterAttributes!
    relationships: [ChapterRelationship]
  }

  type Query {
    chapters(mangaId: ID!): [Chapter]
    chapterImgs(chapterId: ID!): [String!]!
  }
`

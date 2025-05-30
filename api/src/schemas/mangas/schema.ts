export const typeDefs = `#graphql 
  type Manga {
    id: ID!
    type: String
    attributes: MangaAttributes
    relationships: [Relationship!]!
  }

  type MangaAttributes {
    title: LocalizedString
    altTitles: [LocalizedString]
    description: LocalizedString
    isLocked: Boolean
    links: MangaLinks
    originalLanguage: String
    lastVolume: String
    lastChapter: String
    publicationDemographic: String
    status: String
    year: Int
    contentRating: String
    tags: [Tag]
    state: String
    chapterNumbersResetOnNewVolume: Boolean
    createdAt: String
    updatedAt: String
    version: Int
    availableTranslatedLanguages: [String]
    latestUploadedChapter: String
  }

  type LocalizedString {
    en: String
    ko: String
    ja: String
    ru: String
    zh: String
    pt_br: String
  }

  type MangaLinks {
    al: String
    ap: String
    bw: String
    kt: String
    mu: String
    nu: String
    amz: String
    ebj: String
    mal: String
    raw: String
    engtl: String
  }

  type Tag {
    id: ID!
    type: String
    attributes: TagAttributes
    relationships: [Relationship]
  }

  type TagAttributes {
    name: LocalizedString
    description: String
    group: String
    version: Int
  }

  type Relationship {
    id: ID!
    type: String
    related: String
    attributes: RelationshipAttributes
  }

  type RelationshipAttributes {
    description: String
    volume: String
    fileName: String
    locale: String
    createdAt: String
    updatedAt: String
    version: Int
  }

  type Query {
    mangas: [Manga!]!
  }
`

export const mangaTypeDefs = `#graphql 
  type Manga {
    id: ID!
    type: String
    attributes: MangaAttributes
    relationships: [MangaRelationship!]!
    "Full MangaDex cover URL, built server-side from the cover_art relationship. size = thumbnail width (256/512) or 0 for the original."
    coverUrl(size: Int = 512): String
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
    relationships: [MangaRelationship]
  }

  type TagAttributes {
    name: LocalizedString
    description: String
    group: String
    version: Int
  }

  type MangaRelationship {
    id: ID!
    type: String
    related: String
    attributes: MangaRelationshipAttributes
  }

  type MangaRelationshipAttributes {
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
    "A single manga by id (with cover_art + author includes)"
    manga(id: ID!): Manga
    mangasByName(mangaName: String, limit: Int): [Manga!]!
    "Titles filtered by one or more MangaDex tag ids (includedTags[]=), most followed first"
    mangasByTag(includedTags: [ID!]!, limit: Int): [Manga!]!
    "Most recently uploaded chapters (order[latestUploadedChapter]=desc)"
    latestUpdates(limit: Int): [Manga!]!
    "Most recently added titles (order[createdAt]=desc)"
    recentlyAdded(limit: Int): [Manga!]!
    "Most followed titles (order[followedCount]=desc)"
    highestRanking(limit: Int): [Manga!]!
  }
`

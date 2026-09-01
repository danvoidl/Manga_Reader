interface ChapterAttributes {
  volume: string
  chapter: string
  title: string
  translatedLanguage: string
  externalUrl: string
  publishAt: string
  readableAt: string
  createdAt: string
  updatedAt: string
  pages: number
  version: number
}

interface ScanlationGroupAttributes {
  name: string
  altNames: [string]
  locked: boolean
  website: string
  ircServer: string
  ircChannel: string
  discord: string
  contactEmail: string
  description: string
  twitter: string
  mangaUpdates: string
  focusedLanguages: [string]
  official: boolean
  verified: boolean
  inactive: boolean
  publishDelay: string
  exLicensed: boolean
  createdAt: string
  updatedAt: string
  version: number
}

interface UserAttributes {
  username: string
  roles: [string]
  version: number
}

export type RelationshipAttributes = ScanlationGroupAttributes | UserAttributes

export interface Relationship {
  id: string
  type: 'scanlation_group' | 'manga' | 'user'
  attributes: RelationshipAttributes
}

export interface Chapter {
  id: string
  type: string
  attributes: ChapterAttributes
  relationships: [Relationship]
}


export interface GetChapterImgs {
  result: string
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
}
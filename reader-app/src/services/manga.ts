import { graphql } from '@/gql'

// Lean fields for the horizontal card lists. Each list query aliases its root
// to `mangas` so callers/hooks can always read `data.mangas`.
// The cover URL is built server-side (coverUrl) — the client no longer assembles it.
const CARD_FIELDS = graphql(`
  fragment CardFields on Manga {
    id
    cover: coverUrl(size: 512)
    attributes {
      contentRating
      title {
        en
        pt_br
        ja
      }
      altTitles {
        en
        pt_br
      }
    }
  }
`)

// Richer fields for the banner + detail page (adds synopsis + tags).
const DETAIL_FIELDS = graphql(`
  fragment DetailFields on Manga {
    id
    cover: coverUrl(size: 512)
    attributes {
      contentRating
      title {
        en
        pt_br
        ja
      }
      altTitles {
        en
        pt_br
      }
      description {
        en
        pt_br
      }
      tags {
        attributes {
          name {
            en
          }
        }
      }
    }
  }
`)

export const LATEST_UPDATES_QUERY = graphql(`
  query LatestUpdates($limit: Int) {
    mangas: latestUpdates(limit: $limit) {
      ...CardFields
    }
  }
`)

export const RECENTLY_ADDED_QUERY = graphql(`
  query RecentlyAdded($limit: Int) {
    mangas: recentlyAdded(limit: $limit) {
      ...CardFields
    }
  }
`)

export const HIGHEST_RANKING_QUERY = graphql(`
  query HighestRanking($limit: Int) {
    mangas: highestRanking(limit: $limit) {
      ...CardFields
    }
  }
`)

// Featured carousel (Board) — highest ranking, but with synopsis + tags.
export const MOST_POPULAR_QUERY = graphql(`
  query Featured($limit: Int) {
    mangas: mostPopular(limit: $limit) {
      ...DetailFields
    }
  }
`)

export const MANGA_BY_ID_QUERY = graphql(`
  query Manga($id: ID!) {
    manga(id: $id) {
      ...DetailFields
    }
  }
`)

// Genre rows on the home screen. Filters by MangaDex tag ids (includedTags[]).
export const MANGAS_BY_TAG_QUERY = graphql(`
  query MangasByTag($includedTags: [ID!]!, $limit: Int) {
    mangas: mangasByTag(includedTags: $includedTags, limit: $limit) {
      ...CardFields
    }
  }
`)

// Explore search — title match.
export const MANGAS_BY_NAME_QUERY = graphql(`
  query MangasByName($mangaName: String, $limit: Int) {
    mangas: mangasByName(mangaName: $mangaName, limit: $limit) {
      ...CardFields
    }
  }
`)

// Explore screen — optional title + multiple sort criteria + included tag ids.
export const EXPLORE_MANGAS_QUERY = graphql(`
  query ExploreMangas(
    $title: String
    $order: [MangaOrderInput!]
    $includedTags: [ID!]
    $limit: Int
  ) {
    mangas: exploreMangas(
      title: $title
      order: $order
      includedTags: $includedTags
      limit: $limit
    ) {
      ...CardFields
    }
  }
`)

export const CHAPTERS_QUERY = graphql(`
  query Chapters($mangaId: ID!, $limit: Int, $offset: Int, $order: ChapterOrder) {
    chapters(mangaId: $mangaId, limit: $limit, offset: $offset, order: $order) {
      total
      limit
      offset
      items {
        id
        attributes {
          chapter
          title
          translatedLanguage
        }
        relationships {
          type
          attributes {
            ... on ScanlationGroupAttributes {
              name
            }
          }
        }
      }
    }
  }
`)

export const CHAPTER_IMGS_QUERY = graphql(`
  query ChapterImgs($chapterId: ID!) {
    chapterImgs(chapterId: $chapterId)
  }
`)

export const ADJACENT_CHAPTERS_QUERY = graphql(`
  query AdjacentChapters($mangaId: ID!, $chapterId: ID!) {
    adjacentChapters(mangaId: $mangaId, chapterId: $chapterId) {
      next {
        ...ChapterFields
      }
      prev {
        ...ChapterFields
      }
    }
  }
`)

export const CHAPTER = graphql(`
  fragment ChapterFields on Chapter {
    id
    attributes {
      chapter
      title
      translatedLanguage
    }
    relationships {
      type
      attributes {
        ... on ScanlationGroupAttributes {
          name
        }
      }
    }
  }
`)

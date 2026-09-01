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

// Home banner — recently added titles (last 30 days) ordered by rating.
export const TOP_RATED_RECENT_QUERY = graphql(`
  query TopRatedRecent($limit: Int) {
    mangas: topRatedRecent(limit: $limit) {
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
          externalUrl
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

// A single chapter by id — the reader uses this to detect official-publisher
// chapters (externalUrl set, no at-home pages) and route to the external link.
export const CHAPTER_QUERY = graphql(`
  query Chapter($id: ID!) {
    chapter(id: $id) {
      id
      attributes {
        chapter
        title
        externalUrl
      }
    }
  }
`)

// Home "Últimos capítulos adicionados" — global latest chapter uploads, each
// with its manga (CardFields) so we get the cover + title for the card.
export const LATEST_CHAPTERS_QUERY = graphql(`
  query LatestChapters($limit: Int) {
    latestChapters(limit: $limit) {
      id
      chapter
      title
      groupName
      externalUrl
      manga {
        ...CardFields
      }
    }
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
      externalUrl
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

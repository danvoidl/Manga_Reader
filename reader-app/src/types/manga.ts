import { CardFieldsFragment, ChapterFieldsFragment, DetailFieldsFragment } from "@/gql/graphql";

// ---- UI shapes -------------------------------------------------------------

// Minimal shape rendered by the card lists (VerticalManga / MangaSection).
export interface MangaCover {
  cover: string;
  name: string;
  id?: string;
  description?: string;
}

// Richer shape for the banner + the manga detail page (cover, synopsis, tags).
export interface MangaDetail {
  id: string;
  name: string;
  cover?: string;
  description: string;
  tags: string[];
}

// A single chapter row (no image): number + title, scan group, language.
export interface ChapterRow {
  id: string;
  number: string;
  name: string;
  scan: string;
  lang: string;
}

// ---- GraphQL response shapes ----------------------------------------------

export type Manga = CardFieldsFragment
export type MangaWithDetail = DetailFieldsFragment 
export type MangaChapter = ChapterFieldsFragment
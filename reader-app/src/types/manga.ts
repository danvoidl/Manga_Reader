// Shape rendered by the UI (VerticalManga / MangaSection).
export interface MangaCover {
  cover: string;
  name: string;
  id?: string;
  description?: string;
}

// Subset of the GraphQL `Manga` type we actually query.
export interface LocalizedString {
  en?: string | null;
  ja?: string | null;
  ko?: string | null;
  ru?: string | null;
  zh?: string | null;
  pt_br?: string | null;
}

export interface GqlMangaRelationship {
  attributes?: { fileName?: string | null } | null;
}

export interface GqlManga {
  id: string;
  attributes?: {
    title?: LocalizedString | null;
    // MangaDex often stores the canonical title in the original romanized
    // language (e.g. ko-ro) and keeps the English/pt-br title here.
    altTitles?: (LocalizedString | null)[] | null;
  } | null;
  relationships: GqlMangaRelationship[];
}

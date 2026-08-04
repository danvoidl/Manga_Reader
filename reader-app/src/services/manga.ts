import type { GqlManga, LocalizedString, MangaCover } from "@/types/manga";

const COVERS_BASE_URL = process.env.EXPO_PUBLIC_COVER_API_URL;

// Fields selected for every manga-list query. Each query aliases its root to
// `mangas` so callers/hooks can always read `data.mangas`.
const MANGA_FIELDS = `
  id
  attributes {
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
  relationships {
    attributes {
      fileName
    }
  }
`;

export const LATEST_UPDATES_QUERY = `
  query LatestUpdates($limit: Int) {
    mangas: latestUpdates(limit: $limit) { ${MANGA_FIELDS} }
  }
`;

export const RECENTLY_ADDED_QUERY = `
  query RecentlyAdded($limit: Int) {
    mangas: recentlyAdded(limit: $limit) { ${MANGA_FIELDS} }
  }
`;

export const HIGHEST_RANKING_QUERY = `
  query HighestRanking($limit: Int) {
    mangas: highestRanking(limit: $limit) { ${MANGA_FIELDS} }
  }
`;

export interface MangaListResponse {
  mangas: GqlManga[];
}

function firstValue(loc?: LocalizedString | null): string | undefined {
  if (!loc) return undefined;
  return Object.values(loc).find((value): value is string => Boolean(value));
}

function pickTitle(attributes?: GqlManga["attributes"]): string {
  const title = attributes?.title;
  const altTitles = attributes?.altTitles ?? [];

  // Prefer the canonical title in a language we can read, then fall back to an
  // English/pt-br alt title, then any populated value, then a placeholder.
  return (
    title?.en ??
    title?.pt_br ??
    title?.ja ??
    altTitles.find((alt) => alt?.en)?.en ??
    altTitles.find((alt) => alt?.pt_br)?.pt_br ??
    firstValue(title) ??
    "Sem título"
  );
}

function pickCover(manga: GqlManga): string | undefined {
  const fileName = manga.relationships.find((rel) => rel.attributes?.fileName)
    ?.attributes?.fileName;

  if (!fileName) return undefined;

  // `.256.jpg` requests the small thumbnail variant.
  return `${COVERS_BASE_URL}/${manga.id}/${fileName}.256.jpg`;
}

// Maps a GraphQL manga into the shape the UI renders, dropping entries with no cover.
export function toMangaCovers(mangas: GqlManga[]): MangaCover[] {
  return mangas.reduce<MangaCover[]>((acc, manga) => {
    const cover = pickCover(manga);

    if (cover) {
      acc.push({
        id: manga.id,
        name: pickTitle(manga.attributes),
        cover,
      });
    }

    return acc;
  }, []);
}

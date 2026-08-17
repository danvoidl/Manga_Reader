import {
  LatestChapterRow,
  Manga,
  MangaChapter,
  MangaCover,
  MangaDetail,
  MangaWithDetail
} from '@/types/manga'

// A single entry from the LatestChapters query (chapter fields + its manga card).
interface LatestChapterItem {
  id: string
  chapter?: string | null
  title?: string | null
  groupName?: string | null
  manga: Manga
}

function firstValue(
  loc?: Record<string, string | null | undefined> | null
): string | undefined {
  if (!loc) return undefined
  return Object.values(loc).find((value): value is string => Boolean(value))
}

export function pickTitle(attributes?: Manga['attributes']): string {
  const title = attributes?.title
  const altTitles = attributes?.altTitles ?? []

  // Prefer the canonical title in a language we can read, then fall back to an
  // English/pt-br alt title, then any populated value, then a placeholder.
  return (
    title?.en ??
    title?.pt_br ??
    title?.ja ??
    altTitles.find((alt) => alt?.en)?.en ??
    altTitles.find((alt) => alt?.pt_br)?.pt_br ??
    firstValue(title) ??
    'Sem título'
  )
}

function pickDescription(attributes?: MangaWithDetail['attributes']): string {
  const description = attributes?.description
  return description?.pt_br ?? description?.en ?? firstValue(description) ?? ''
}

function pickTags(attributes?: MangaWithDetail['attributes']): string[] {
  return (attributes?.tags ?? [])
    .map((tag) => tag?.attributes?.name?.en)
    .filter((name): name is string => Boolean(name))
}

// MangaDex's "Long Strip" format tag — matched loosely (case/whitespace
// insensitive) since only the display name survives into MangaDetail.tags.
export function isLongStrip(tags: string[]): boolean {
  return tags.some((tag) => tag.replace(/\s+/g, '').toLowerCase() === 'longstrip')
}

// Maps a GraphQL manga into the lean card shape, dropping entries with no cover.
export function toMangaCovers(mangas: Manga[]): MangaCover[] {
  return mangas.reduce<MangaCover[]>((acc, manga) => {
    if (manga.cover) {
      acc.push({
        id: manga.id,
        name: pickTitle(manga.attributes),
        cover: manga.cover
      })
    }

    return acc
  }, [])
}

export function toMangaDetail(
  manga: MangaWithDetail | null
): MangaDetail | null {
  if (!manga) return null

  return {
    id: manga.id,
    name: pickTitle(manga.attributes),
    cover: manga.cover ?? undefined,
    description: pickDescription(manga.attributes),
    tags: pickTags(manga.attributes),
    contentRating: manga.attributes?.contentRating || ''
  }
}

// Banner carousel entries (require a cover to render).
export function toMangaBanners(mangas: MangaWithDetail[]): MangaDetail[] {
  return mangas
    .map(toMangaDetail)
    .filter((manga): manga is MangaDetail => Boolean(manga && manga.cover))
}

// Maps the LatestChapters query into home-carousel cards, dropping entries
// whose manga has no cover (nothing to show).
export function toLatestChapterRows(
  items: LatestChapterItem[]
): LatestChapterRow[] {
  return items.reduce<LatestChapterRow[]>((acc, item) => {
    if (item.manga?.cover) {
      acc.push({
        chapterId: item.id,
        number: item.chapter ?? '',
        title: item.title ?? '',
        group: item.groupName ?? 'Scan desconhecida',
        mangaId: item.manga.id,
        mangaName: pickTitle(item.manga.attributes),
        cover: item.manga.cover
      })
    }

    return acc
  }, [])
}

export function toChapterRows(items: MangaChapter[]) {
  return items.map((chapter) => {
    const scan = chapter.relationships?.find(
      (rel) => rel?.type === 'scanlation_group' && rel.attributes?.name
    )?.attributes?.name

    return {
      id: chapter.id,
      number: chapter.attributes?.chapter ?? '',
      name: chapter.attributes?.title ?? '',
      scan: scan ?? 'Scan desconhecida',
      lang: chapter.attributes?.translatedLanguage ?? '',
    }
  })
}

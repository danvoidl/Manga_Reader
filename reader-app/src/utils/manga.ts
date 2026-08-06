import {
  Manga,
  MangaChapter,
  MangaCover,
  MangaDetail,
  MangaWithDetail
} from '@/types/manga'

function firstValue(
  loc?: Record<string, string | null | undefined> | null
): string | undefined {
  if (!loc) return undefined
  return Object.values(loc).find((value): value is string => Boolean(value))
}

function pickTitle(attributes?: Manga['attributes']): string {
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
    tags: pickTags(manga.attributes)
  }
}

// Banner carousel entries (require a cover to render).
export function toMangaBanners(mangas: MangaWithDetail[]): MangaDetail[] {
  return mangas
    .map(toMangaDetail)
    .filter((manga): manga is MangaDetail => Boolean(manga && manga.cover))
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
      lang: chapter.attributes?.translatedLanguage ?? ''
    }
  })
}

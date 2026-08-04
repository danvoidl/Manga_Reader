import { useEffect, useState } from "react";
import { gqlRequest } from "@/services/graphql";
import { toMangaCovers, type MangaListResponse } from "@/services/manga";
import type { MangaCover } from "@/types/manga";

interface UseMangasResult {
  data: MangaCover[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches a manga list from the GraphQL API. `query` must alias its root field
 * to `mangas` (see the queries in services/manga.ts).
 */
export function useMangas(query: string, limit = 8): UseMangasResult {
  const [data, setData] = useState<MangaCover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    gqlRequest<MangaListResponse>(query, { limit })
      .then((resp) => {
        if (!active) return;
        setData(toMangaCovers(resp.mangas));
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar mangás");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, limit]);

  return { data, loading, error };
}

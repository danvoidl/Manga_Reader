import { useMangas } from "@/hooks/useMangas";
import { HIGHEST_RANKING_QUERY } from "@/services/manga";
import MangaSection from "./MangaSection";

export default function HighestRanking() {
  const { data, loading, error, refetch } = useMangas(HIGHEST_RANKING_QUERY);

  return (
    <MangaSection
      title="Highest Ranking"
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
    />
  );
}

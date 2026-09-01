import { useMangas } from "@/hooks/useMangas";
import { RECENTLY_ADDED_QUERY } from "@/services/manga";
import MangaSection from "./MangaSection";

export default function RecentlyAdded() {
  const { data, loading, error, refetch } = useMangas(RECENTLY_ADDED_QUERY);

  return (
    <MangaSection
      title="Recentemente adicionados"
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
    />
  );
}

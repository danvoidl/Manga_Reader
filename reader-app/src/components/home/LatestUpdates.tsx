import { useMangas } from "@/hooks/useMangas";
import { LATEST_UPDATES_QUERY } from "@/services/manga";
import MangaSection from "./MangaSection";

export default function LatestUpdates() {
  const { data, loading, error } = useMangas(LATEST_UPDATES_QUERY);

  return (
    <MangaSection
      title="Latest Updates"
      data={data}
      loading={loading}
      error={error}
    />
  );
}

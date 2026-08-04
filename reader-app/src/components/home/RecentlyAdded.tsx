import { useMangas } from "@/hooks/useMangas";
import { RECENTLY_ADDED_QUERY } from "@/services/manga";
import MangaSection from "./MangaSection";

export default function RecentlyAdded() {
  const { data, loading, error } = useMangas(RECENTLY_ADDED_QUERY);

  return (
    <MangaSection
      title="Recently Added"
      data={data}
      loading={loading}
      error={error}
    />
  );
}

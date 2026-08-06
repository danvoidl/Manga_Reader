import { useEffect, useRef } from "react";
import { useChapterControl } from "@/store/ChapterControlContext";
import { useContinueReading } from "@/store/ContinueReadingContext";

interface Props {
  mangaId?: string;
  mangaName?: string;
  chapterId?: string;
  chapterNumber?: string;
  chapterName?: string;
}

// Sits inside ChapterControlProvider so it can read the live page state.
// On open it records the chapter (with a random page as the cover); on exit it
// persists the last read progress. Renders nothing.
export function ReadingTracker({
  mangaId,
  mangaName,
  chapterId,
  chapterNumber,
  chapterName,
}: Props) {
  const { pages, currentPage, totalPages } = useChapterControl();
  const { recordOpen, updateProgress } = useContinueReading();

  // Keep the latest progress for the unmount write without re-running effects.
  const progressRef = useRef(0);
  progressRef.current = totalPages > 0 ? (currentPage + 1) / totalPages : 0;

  useEffect(() => {
    if (!mangaId || !chapterId || pages.length === 0) return;

    const image = pages[Math.floor(Math.random() * pages.length)];

    recordOpen({
      mangaId,
      mangaName: mangaName ?? "",
      chapterId,
      chapterNumber: chapterNumber ?? "",
      chapterName: chapterName ?? "",
      image,
    });

    return () => {
      updateProgress(chapterId, progressRef.current);
    };
  }, [mangaId, chapterId]);

  return null;
}

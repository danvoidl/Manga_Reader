import { useEffect, useRef } from "react";
import { useChapterControl } from "@/store/ChapterControlContext";
import { useContinueReading } from "@/store/ContinueReadingStore";

interface Props {
  mangaId?: string;
  mangaName?: string;
  chapterId?: string;
  chapterNumber?: string;
  chapterName?: string;
}

// Sits inside ChapterControlProvider so it can read the live page state.
// On open it records the chapter (with the current page as the cover); on exit
// it persists the last read page, progress and cover. Renders nothing.
export function ReadingTracker({
  mangaId,
  mangaName,
  chapterId,
  chapterNumber,
  chapterName,
}: Props) {
  const { pages, currentPage, totalPages } = useChapterControl();
  const recordOpen = useContinueReading((s) => s.recordOpen);
  const updateProgress = useContinueReading((s) => s.updateProgress);

  // Keep the latest page/progress for the unmount write without re-running effects.
  const pageRef = useRef(0);
  const progressRef = useRef(0);
  pageRef.current = currentPage;
  progressRef.current = totalPages > 0 ? (currentPage + 1) / totalPages : 0;

  useEffect(() => {
    if (!mangaId || !chapterId || pages.length === 0) return;

    recordOpen({
      mangaId,
      mangaName: mangaName ?? "",
      chapterId,
      chapterNumber: chapterNumber ?? "",
      chapterName: chapterName ?? "",
      image: pages[currentPage] ?? pages[0],
    });

    return () => {
      updateProgress(
        chapterId,
        pageRef.current,
        progressRef.current,
        pages[pageRef.current] ?? pages[0]
      );
    };
  }, [mangaId, chapterId]);

  return null;
}

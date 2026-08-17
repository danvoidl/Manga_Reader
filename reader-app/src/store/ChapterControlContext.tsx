import { createContext, useContext, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import type { ReadingMode } from "./ReadingModeContext";

interface Props {
  pages: string[];
  initialPage?: number;
  mode: ReadingMode;
  onChangeMode: (mode: ReadingMode) => void;
  children: React.ReactNode;
}

interface CtxProps {
  handlePageChange: (page: number) => void;
  pages: string[];
  totalPages: number;
  currentPage: number;
  initialPage: number;
  chapterListRef: React.RefObject<FlatList<any> | null>;
  handleSlide: (page: number, animated?: boolean) => void;
  mode: ReadingMode;
  setMode: (mode: ReadingMode) => void;
}

export const ChapterControlContext = createContext<CtxProps | undefined>(
  undefined
);

export function useChapterControl() {
  const context = useContext(ChapterControlContext);

  if (!context) {
    throw new Error(
      "useSystemBars deve ser usado dentro de um SystemBarsProvider"
    );
  }

  return context;
}

export function ChapterControlProvider({
  children,
  pages,
  initialPage = 0,
  mode,
  onChangeMode,
}: Props) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const chapterListRef = useRef<FlatList>(null);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  function handleSlide(newPage: number, animated = true) {
    handlePageChange(newPage);

    chapterListRef.current?.scrollToIndex({ index: newPage, animated });
  }

  return (
    <ChapterControlContext.Provider
      value={{
        currentPage,
        initialPage,
        pages,
        totalPages: pages.length,
        handlePageChange,
        chapterListRef,
        handleSlide,
        mode,
        setMode: onChangeMode,
      }}
    >
      {children}
    </ChapterControlContext.Provider>
  );
}

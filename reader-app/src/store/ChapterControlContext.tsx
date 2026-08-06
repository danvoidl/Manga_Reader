import { createContext, useContext, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  pages: string[];
  initialPage?: number;
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
      }}
    >
      {children}
    </ChapterControlContext.Provider>
  );
}

import { createContext, useContext, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { chapters } from "@/seed/chapters";

interface Props {
  totalPages?: number;
  children: React.ReactNode;
}

interface CtxProps {
  handlePageChange: (page: number) => void;
  totalPages: number;
  currentPage: number;
  chapterListRef: React.RefObject<FlatList<any> | null>;
  handleSlide: (page: number) => void
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

export function ChapterControlProvider({ children, totalPages = 0 }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const chapterListRef = useRef<FlatList>(null);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage) 

  function handleSlide(newPage: number) {
    handlePageChange(newPage);

    chapterListRef.current?.scrollToIndex({ index: newPage, animated: true });
  }

  return (
    <ChapterControlContext.Provider
      value={{
        currentPage,
        totalPages: chapters.length,
        handlePageChange,
        chapterListRef,
        handleSlide
      }}
    >
      {children}
    </ChapterControlContext.Provider>
  );
}

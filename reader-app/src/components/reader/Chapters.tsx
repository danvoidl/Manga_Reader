import { ReactNode } from 'react'
import { useChapterControl } from '@/store/ChapterControlContext'
import { HorizontalChapters } from './HorizontalChapters'
import { VerticalChapters } from './VerticalChapters'

interface Props {
  endSlide?: ReactNode
}

export function Chapters({ endSlide }: Props) {
  const { mode } = useChapterControl()

  return mode === 'vertical' ? (
    <VerticalChapters endSlide={endSlide} />
  ) : (
    <HorizontalChapters endSlide={endSlide} />
  )
}

import { Zoomable } from "@likashefqet/react-native-image-zoom";

interface ZoomAreaProps {
  children: React.ReactNode;
  toggleBars: () => void;
}

export function ZoomArea({ children, toggleBars }: ZoomAreaProps) {
  return (
    <Zoomable
      isDoubleTapEnabled
      isSingleTapEnabled
      maxScale={2}
      onSingleTap={toggleBars}
      onMagicTap={toggleBars}
    >
      {children}
    </Zoomable>
  );
}

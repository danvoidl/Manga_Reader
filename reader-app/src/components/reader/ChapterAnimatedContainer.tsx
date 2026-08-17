import { useSystemBars } from "@/store/SystemBarsContext";
import { GenericComponentProps } from "@/types/general";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export function ChapterAnimatedContainer({ children }: GenericComponentProps) {
  const { isSystemBarsVisible } = useSystemBars();
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
    };
  });

  useEffect(() => {
    opacity.set(withTiming(isSystemBarsVisible ? 1 : 0, { duration: 500 }));
  }, [isSystemBarsVisible]);

  return (
    <Animated.View
      // When the bars are hidden the overlay must let every touch fall through
      // to the reader below (scroll + tap-to-toggle); when visible, "box-none"
      // keeps the layer itself transparent to touches while the real controls
      // (buttons, slider) stay interactive.
      pointerEvents={isSystemBarsVisible ? "box-none" : "none"}
      className="absolute inset-0 justify-between items-center"
      style={[animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

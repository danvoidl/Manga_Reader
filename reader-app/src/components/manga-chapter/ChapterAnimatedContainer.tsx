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
    console.log('SYSTEMBARVISIBLE', isSystemBarsVisible, opacity.get());
    

    opacity.set(withTiming(isSystemBarsVisible ? 1 : 0, { duration: 500 }));
  }, [isSystemBarsVisible]);

  return (
    <Animated.View
      className="absolute inset-0 justify-between items-center"
      style={[animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

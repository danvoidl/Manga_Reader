import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";

export default function BoardPaginator({ data, scrollX }: { data: any[], scrollX: Animated.Value }) {
  const { width } = useWindowDimensions()

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: 10,
        position: "absolute",
        zIndex: 50,
        bottom: 16,
        justifyContent: "center",
        width: '100%'
      }}
    >
      {data.map((_, i) => {
        const inputRange = [(i -1 ) * width, i * width, (i + 1) * width]

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp'
        })

        return <Animated.View key={i.toString()} style={[styles.dot, { width: 8, opacity }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 8,
  },
});

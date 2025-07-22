import { View, Text } from "react-native";
import AppText from "./AppText";

type ChipType = "default" | "suggestive";

interface ChipStyle {
  text: string;
  bg: string;
}

interface ChipProps {
  text: string;
  type?: ChipType;
}

export default function Chip({ text, type = "default" }: ChipProps) {
  const chipStyle: Record<ChipType, ChipStyle> = {
    suggestive: {
      bg: "bg-orange-600",
      text: "text-white",
    },
    default: {
      bg: "bg-[#3F3F3F]",
      text: "text-white/60",
    },
  };

  return (
    <View
      className={`${chipStyle[type].bg} p-0.5 px-2 max-w-fit !rounded-full text-white/60`}
      style={{ alignSelf: "flex-start" }}
    >
      <AppText
        size="xs"
        text={text}
        className={`font-semibold ${chipStyle[type].text}`}
      />
    </View>
  );
}

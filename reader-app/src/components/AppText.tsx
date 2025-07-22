import { Text } from "react-native";

type Sizes = "title" | "subtitle" | "text" | "sub" | "xs";

interface AppTextProps {
  text: string;
  size?: Sizes;
  className?: string;
}

const sizeClasses: Record<Sizes, string> = {
  title: "text-white font-semibold text-3xl",
  subtitle: "text-white font-semibold text-2xl",
  text: "text-white text-base",
  sub: "text-white text-sm",
  xs: "text-xs"
};

export default function AppText({ text, size = "text", className = '' }: AppTextProps) {
  return <Text className={`${sizeClasses[size]} ${className}`}>{text}</Text>;
}

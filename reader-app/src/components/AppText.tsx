import { Text } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const appText = tv({
  variants: {
    size: {
      title: "text-white font-semibold text-3xl",
      subtitle: "text-white font-semibold text-2xl",
      text: "text-white text-base",
      sub: "text-white text-sm",
      xs: "text-xs",
    },
  },
  defaultVariants: {
    size: "text",
  },
});

type AppTextVariants = VariantProps<typeof appText>;

interface AppTextProps {
  text: string;
  size?: AppTextVariants["size"];
  className?: string;
}

export default function AppText({ text, size = "text", className }: AppTextProps) {
  return <Text className={appText({ size, className })}>{text}</Text>;
}

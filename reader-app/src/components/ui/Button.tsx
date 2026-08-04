import { ActivityIndicator, Pressable } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import AppText from "@/components/AppText";

const button = tv({
  slots: {
    container: "h-12 flex-row items-center justify-center rounded-lg px-6",
    label: "font-semibold",
  },
  variants: {
    variant: {
      primary: { container: "bg-callout", label: "text-default-black" },
      ghost: { container: "bg-transparent", label: "text-callout" },
    },
    disabled: {
      true: { container: "opacity-50" },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariants["variant"];
  className?: string;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container, label } = button({ variant, disabled: isDisabled });

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={container({ className })}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#262626" : "#AD89FF"} />
      ) : (
        <AppText text={title} className={label()} />
      )}
    </Pressable>
  );
}

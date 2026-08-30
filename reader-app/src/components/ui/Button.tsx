import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import Icon from "@react-native-vector-icons/material-design-icons";
import { tv, type VariantProps } from "tailwind-variants";
import AppText from "@/components/AppText";

const button = tv({
  slots: {
    container: "h-12 flex-row items-center justify-center gap-2 rounded-lg px-6",
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
  /** Optional leading icon (material-design-icons name). */
  icon?: ComponentProps<typeof Icon>["name"];
  className?: string;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  icon,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container, label } = button({ variant, disabled: isDisabled });
  const contentColor = variant === "primary" ? "#262626" : "#AD89FF";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={container({ className })}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={20} color={contentColor} /> : null}
          <AppText text={title} className={label()} />
        </>
      )}
    </Pressable>
  );
}

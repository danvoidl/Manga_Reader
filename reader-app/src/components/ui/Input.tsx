import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { tv } from "tailwind-variants";
import Icon from "@react-native-vector-icons/material-design-icons";
import AppText from "@/components/AppText";

const input = tv({
  slots: {
    root: "w-full",
    labelRow: "mb-2 ml-1 flex-row items-center justify-between",
    field: "flex-row items-center rounded-lg border bg-[#3F3F3F] px-4",
    control: "h-12 flex-1 text-base text-white",
  },
  variants: {
    focused: {
      true: { field: "border-callout" },
      false: { field: "border-transparent" },
    },
  },
  defaultVariants: {
    focused: false,
  },
});

interface InputProps extends Omit<TextInputProps, "className"> {
  label: string;
  /** Renders a masked field with an eye toggle to reveal the value. */
  secret?: boolean;
  /** Optional element rendered at the right edge of the label row (e.g. an info icon). */
  rightAccessory?: React.ReactNode;
}

export default function Input({
  label,
  secret = false,
  rightAccessory,
  onFocus,
  onBlur,
  ...inputProps
}: InputProps) {
  const [hidden, setHidden] = useState(secret);
  const [focused, setFocused] = useState(false);

  const { root, labelRow, field, control } = input({ focused });

  return (
    <View className={root()}>
      <View className={labelRow()}>
        <AppText text={label} size="sub" className="text-white/70" />
        {rightAccessory}
      </View>

      <View className={field()}>
        <TextInput
          className={control()}
          placeholderTextColor="#FFFFFF66"
          secureTextEntry={hidden}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />

        {secret ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={10}
            accessibilityLabel={hidden ? "Mostrar" : "Ocultar"}
          >
            <Icon name={hidden ? "eye-off" : "eye"} size={22} color="#FFFFFF99" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

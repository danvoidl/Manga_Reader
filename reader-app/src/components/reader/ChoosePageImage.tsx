import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Image as ImageHandler, Pressable, PressableProps } from "react-native";

interface ChooseChapterImageProps extends PressableProps {
  img: string;
}

export function ChoosePageImage({ img, ...rest }: ChooseChapterImageProps) {
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    if (img)
      ImageHandler.getSize(img, (width, height) => setRatio(width / height));
  }, [img]);

  return (
    <Pressable className="py-2" {...rest}>
      <Image source={img} style={{ width: "100%", aspectRatio: ratio }} />
    </Pressable>
  );
}

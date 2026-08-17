import { useState } from "react";
import { Modal, Pressable } from "react-native";
import Icon from "@react-native-vector-icons/material-design-icons";
import { ChoosePageList } from "./ChoosePageList";

export function ChoosePageModal() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setIsVisible(true)}>
        <Icon name="view-grid-outline" size={28} color="#AD89FF" />
      </Pressable>

      <Modal
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        className=""
      >
        <ChoosePageList onPagePick={() => setIsVisible(false)} />
      </Modal>
    </>
  );
}

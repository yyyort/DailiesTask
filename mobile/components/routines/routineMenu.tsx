import useRoutine from "@/hooks/useRoutine";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import React, { useRef, useState } from "react";
import { Animated, Modal, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "../ui/ThemedView";
import Toast from "react-native-toast-message";
import { RoutineReturnType } from "@/model/routine.model";
import RoutineEditForm from "./routineEditForm";

export default function RoutineMenu({
  routine,
}: {
  routine: RoutineReturnType;
}) {
  const { deleteRoutine } = useRoutine();

  const [open, setOpen] = React.useState(false);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [openEdit, setOpenEdit] = useState(false);

  const buttonRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showPopover = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({
        x: pageX,
        y: pageY,
        width,
        height,
      });
      setOpen(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const hidePopover = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
    });
  };

  return (
    <TouchableOpacity ref={buttonRef} onPress={showPopover}>
      <MaterialCommunityIcons name="menu-down" size={24} color="black" />

      {/* menu */}
      <Modal
        transparent={true}
        visible={open}
        onRequestClose={hidePopover}
        focusable={true}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPress={hidePopover}
        >
          <TouchableOpacity>
            <Animated.View
              style={{
                position: "absolute",
                top: buttonPosition.y + buttonPosition.height,
                left: 20,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                opacity: fadeAnim,
              }}
            >
              <MenuButton
                title="edit"
                onPress={() => {
                  hidePopover();
                  setOpenEdit(true);
                }}
              />
              <View
                style={{
                  height: 0.5,
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "gray",
                  marginVertical: 2,
                }}
              />
              <MenuButton
                title="delete"
                onPress={async () => {
                  try {
                    await deleteRoutine(routine.id);

                    //toast
                    Toast.show({
                      type: "success",
                      text1: "Success",
                      text2: `successfully delete routine`,
                      text1Style: { fontSize: 20 },
                      text2Style: { fontSize: 15 },
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* edit modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={openEdit}
        onRequestClose={() => {
          setOpenEdit(false);
        }}
        focusable={true}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={() => setOpenEdit(false)}
        />
        <ThemedView
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "80%",
            zIndex: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingBottom: 10,
            }}
          >
            <ThemedText type="title">Edit Routine</ThemedText>
            <AntDesign
              name="close"
              size={32}
              color="black"
              onPress={() => setOpenEdit(false)}
            />
          </View>

          {/* form */}
          <RoutineEditForm routine={routine} setModalOpen={setOpenEdit} />
        </ThemedView>
      </Modal>
    </TouchableOpacity>
  );
}

export function MenuButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        width: 100,
      }}
    >
      <ThemedText>{title}</ThemedText>
    </TouchableOpacity>
  );
}

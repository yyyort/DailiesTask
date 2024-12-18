import React, { useRef, useState } from "react";
import { ThemedView } from "../ui/ThemedView";
import { TaskReturnType, TaskTodayReturnType } from "@/model/task.model";
import { ThemedText } from "../ui/ThemedText";
import {
  Animated,
  Modal,
  Touchable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import CheckBox from "expo-checkbox";
import useTasks from "@/hooks/useTask";
import Toast from "react-native-toast-message";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import TaskAddForm from "./taskAddForm";
import TaskEditForm from "./taskEditForm";

export default function TaskContainer({ task }: { task: TaskTodayReturnType }) {
  const { updateStutus } = useTasks();

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        marginVertical: 5,
      }}
    >
      {/* menu */}
      <TaskPopOverMenu task={task} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <ThemedText
          style={{
            textDecorationLine:
              task.status === "done" ? "line-through" : "none",
            color: task.status === "done" ? "gray" : "black",
            fontSize: 20,
          }}
        >
          {
            //limit the title to 20 characters
            task.title.length > 20
              ? task.title.slice(0, 20) + "..."
              : task.title
          }
        </ThemedText>
        <ThemedText>{task.timeToDo.slice(0, 5)}</ThemedText>
      </View>

      {/* 
            checkbox
        */}
      <CheckBox
        value={task.status === "done"}
        onValueChange={async (value) => {
          try {
            const res = await updateStutus(task.id, value ? "done" : "todo");

            //toast
            Toast.show({
              type: "success",
              text1: "Success",
              text2: `successfully updated task ${res.title}`,
              text1Style: { fontSize: 20 },
              text2Style: { fontSize: 15 },
            });
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </ThemedView>
  );
}

export function TaskPopOverMenu({ task }: { task: TaskReturnType }) {
  const { deleteTask } = useTasks();

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
      <Entypo name="dots-two-vertical" size={24} color="black" />

      {/* pop over menu modal */}
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
              <TaskMenuButton
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
              <TaskMenuButton
                title="delete"
                onPress={async () => {
                  try {
                    const res = await deleteTask(task.id);

                    //toast
                    Toast.show({
                      type: "success",
                      text1: "Success",
                      text2: `successfully delete task ${res.title}`,
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
            height: "70%",
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
            <ThemedText type="title">Edit Task</ThemedText>
            <AntDesign
              name="close"
              size={32}
              color="black"
              onPress={() => setOpenEdit(false)}
            />
          </View>

          {/* form */}
          <TaskEditForm task={task} setModalOpen={setOpenEdit} />
        </ThemedView>
      </Modal>
    </TouchableOpacity>
  );
}

export function TaskMenuButton({
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

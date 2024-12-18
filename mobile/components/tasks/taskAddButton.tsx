import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { ThemedButton } from "../ui/ThemedButton";
import { ThemedText } from "../ui/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedView } from "../ui/ThemedView";
import AntDesign from "@expo/vector-icons/AntDesign";
import TaskAddForm from "./taskAddForm";

export default function TaskAddButton() {
  const [formVisible, setFormVisible] = React.useState(false);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 10,
        width: 60,
        height: 60,
      }}
    >
      <TouchableOpacity
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 30,
          backgroundColor: Colors.slate[800],
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setFormVisible(true)}
      >
        <ThemedText style={{ color: "white" }}>
          <FontAwesome6 name="plus" size={24} color="white" />
        </ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={formVisible}
        onRequestClose={() => {
          setFormVisible(false);
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
          onPress={() => setFormVisible(false)}
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
            <ThemedText type="title">Add Task</ThemedText>
            <AntDesign
              name="close"
              size={32}
              color="black"
              onPress={() => setFormVisible(false)}
            />
          </View>

          {/* form */}
          <TaskAddForm setModalOpen={
            setFormVisible
          }/>
        </ThemedView>
      </Modal>
    </View>
  );
}

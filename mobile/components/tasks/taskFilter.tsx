import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Colors } from "@/lib/constants/Colors";

export default function TaskFilter() {
  const [all, setAll] = React.useState(true);
  const [todo, setTodo] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [overdue, setOverdue] = React.useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
      }}
    >
      <Filter
        setEnable={() => {
          setAll(true);
          setTodo(false);
          setDone(false);
          setOverdue(false);
        }}
        enabled={all}
        title="All"
      />
      <Filter
        setEnable={() => {
          setAll(false);
          setTodo(true);
        }}
        enabled={todo}
        title="Todo"
      />
      <Filter
        setEnable={() => {
          setAll(false);
          setDone(true);
        }}
        enabled={done}
        title="Done"
      />
      <Filter
        setEnable={() => {
          setAll(false);
          setOverdue(true);
        }}
        enabled={overdue}
        title="Overdue"
      />
    </View>
  );
}

export function Filter({
  setEnable,
  enabled,
  title,
}: {
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;
  enabled: boolean;
  title: string;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setEnable((prev) => !prev);
        }}
        style={{
          paddingHorizontal: 5,
          paddingVertical: 1,
          borderRadius: 10,
          backgroundColor: enabled ? Colors.slate[300] : "white",
        }}
      >
        <ThemedText>{title}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

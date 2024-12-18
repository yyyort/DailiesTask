import TaskContainer from "@/components/tasks/taskContainer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import React from "react";
import { FlatList, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import TaskFilter from "@/components/tasks/taskFilter";
import TaskAddButton from "@/components/tasks/taskAddButton";
import UseTasks from "@/hooks/useTask";


export default function Tasks() {
  const { getTask } = UseTasks();
  const tasks = getTask();

  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "column",
        height: "100%",
        padding: 26,
        paddingTop: 40,
      }}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          gap: 3,
          alignItems: "center",
          marginLeft: "auto",
          marginBottom: 20,
        }}
      >
        <Feather name="chevron-down" size={24} color="black" />
        <ThemedText type="title">Tasks Today</ThemedText>
      </View>

      {/* task done count */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* filter */}
        <TaskFilter />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "semibold",
            }}
          >
            {tasks.filter((task) => task.status === "done").length} /{" "}
            {tasks.length}
          </ThemedText>
        </View>
      </View>

      {/* tasks */}
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskContainer task={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={{
          flex: 1,
          marginTop: 20,
        }}
      />

      {/* action button */}
      <TaskAddButton />
    </ThemedView>
  );
}

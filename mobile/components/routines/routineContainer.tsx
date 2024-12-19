import { RoutineReturnType } from "@/model/routine.model";
import React from "react";
import { FlatList, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import TaskContainer from "../tasks/taskContainer";
import { Colors } from "@/lib/constants/Colors";
import RoutineMenu from "./routineMenu";

export default function RoutineContainer({
  routine,
}: {
  routine: RoutineReturnType;
}) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 10,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: Colors.slate[200],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <RoutineMenu routine={routine}/>
          <ThemedText type="subtitle">{routine.title}</ThemedText>
        </View>

        <ThemedText type="subtitle">
          {routine.tasks?.filter((task) => task.status === "done").length} /{" "}
          {routine.tasks?.length}
        </ThemedText>
      </View>

      {/* tasks */}
      <FlatList
        data={routine.tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskContainer
            task={{
              id: item.id,
              order: 0,
              title: item.title,
              description: item.description,
              status: item.status,
              timeToDo: item.timeToDo,
              deadline: item.deadline,
            }}
          />
        )}
      />
    </View>
  );
}

import RoutineAddButton from "@/components/routines/routineAddButton";
import RoutineContainer from "@/components/routines/routineContainer";
import RoutineFilter from "@/components/routines/routineFilter";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import useRoutine from "@/hooks/useRoutine";
import { RoutineReturnType } from "@/model/routine.model";
import React from "react";
import { FlatList, View } from "react-native";

export default function Routine() {
  const { getRoutine } = useRoutine();
  const routines = getRoutine();

  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "column",
        height: "100%",
        paddingTop: 40,
      }}
    >
      <View
        style={{
          marginLeft: "auto",
          marginBottom: 8,
          paddingHorizontal: 26,
        }}
      >
        <ThemedText
          type="title"
          style={{
            textAlign: "right",
          }}
        >
          Routines
        </ThemedText>
      </View>

      <View
        style={{
          paddingHorizontal: 26,
          marginBottom: 12,
        }}
      >
        {/* filters */}
        <RoutineFilter routine={routines} />
      </View>

      {/* routines */}
      <FlatList
        style={{}}
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineContainer routine={item} />}
      />

      {/* add routine button */}
      <RoutineAddButton />
    </ThemedView>
  );
}

import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import useTasks from "@/hooks/useTask";

export default function TaskFilter() {
  const [all, setAll] = React.useState<boolean>(true);
  const [todo, setTodo] = React.useState<boolean>(false);
  const [done, setDone] = React.useState<boolean>(false);
  const [overdue, setOverdue] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<("todo" | "done" | "overdue")[]>(
    []
  );
  const { filterTask } = useTasks();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
      }}
    >
      <Filter
        setEnable={async () => {
          setAll(true);
          setTodo(false);
          setDone(false);
          setOverdue(false);
          setFilters([]);
          filterTask([]);
        }}
        enabled={all}
        title="All"
      />
      <Filter
        setEnable={() => {
          if (todo) {
            if (filters.length === 1) {
              setAll(true);
            }
            setTodo(false);
            setFilters((prev) => prev.filter((f) => f !== "todo"));
            filterTask(filters);
          } else {
            setAll(false);
            setTodo(true);
            setFilters((prev) => [...prev, "todo"]);
            filterTask(filters);
          }
        }}
        enabled={todo}
        title="Todo"
      />
      <Filter
        setEnable={() => {
          if (done) {
            if (filters.length === 1) {
              setAll(true);
            }
            setDone(false);
            setFilters((prev) => prev.filter((f) => f !== "done"));
            filterTask(filters);
          } else {
            setAll(false);
            setDone(true);
            setFilters((prev) => [...prev, "done"]);
            filterTask(filters);
          }
        }}
        enabled={done}
        title="Done"
      />
      <Filter
        setEnable={() => {
          if (overdue) {
            if (filters.length === 1) {
              setAll(true);
            }
            setOverdue(false);
            setFilters((prev) => prev.filter((f) => f !== "overdue"));
            filterTask(filters);
          } else {
            setAll(false);
            setOverdue(true);
            setFilters((prev) => [...prev, "overdue"]);
            filterTask(filters);
          }
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
  setEnable: () => void;
  enabled: boolean;
  title: string;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={setEnable}
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

import { ThemedView } from "@/components/ui/ThemedView";
import { Tabs } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="(tasks)/index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="checkbox-active" size={size} color={color} />
          ),
          tabBarLabel: "Tasks",
        }}
      />
      <Tabs.Screen
        name="(routine)/index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="checklist" size={size} color={color} />
          ),
          tabBarLabel: "Tasks",
        }}
      />
    </Tabs>
  );
}

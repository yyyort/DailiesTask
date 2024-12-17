import { ThemedView } from "@/components/ui/ThemedView";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(tasks)"/>
            <Tabs.Screen name="(home)"/>
        </Tabs>
    )
} 
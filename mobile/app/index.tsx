import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ui/ThemedText";

import { useAuth } from "@/hooks/useAuth";


export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(protected)/(routine)" />;
  }

  

  const inset = useSafeAreaInsets();

  if (isLoading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          top: inset.top,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        top: inset.top,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedView>
        <ThemedText style={styles.title} type="title">
          DailiesTask
        </ThemedText>

        <Link href="/(protected)/(tasks)">
          <ThemedText>Tasks</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

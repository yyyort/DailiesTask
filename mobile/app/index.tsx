import { StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ui/ThemedText";

export default function Index() {
  const user = null;

  if (!user) {
    return <Redirect href="/(auth)/signIn" />;
  }

  const inset = useSafeAreaInsets();

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
        <ThemedText style={styles.title} type="title">DailiesTask</ThemedText>
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

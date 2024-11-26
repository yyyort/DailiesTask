import SignInForm from "@/components/auth/signInForm";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import bulb from "@/assets/logo/bulb-black.svg";
import glitter from "@/assets/logo/glitter-black.svg";
import checkbox from "@/assets/logo/checkbox-black.svg";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const inset = useSafeAreaInsets();
  const [loaded] = useFonts({
    Amatic: require("@/assets/fonts/AmaticSC-Bold.ttf"),
  });

  if (!loaded) {
    return null;
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
      <ThemedView
        style={{
          width: "100%",
          paddingHorizontal: 30,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <ThemedText style={styles.title} type="title">
          DailiesTask
        </ThemedText>
        <Image
          source={glitter}
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            top: -20,
            right: 0,
            zIndex: 1,
          }}
          contentFit="contain"
        />
      </ThemedView>

      <ThemedView
        style={{
          position: "relative",
        }}
      >
        {/* form */}
        {children}

        <Image
          source={bulb}
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            bottom: 20,
            left: -20,
          }}
          contentFit="contain"
        />
      </ThemedView>

      <View
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 80,
        }}
      >
        <Image
          source={checkbox}
          style={{
            width: 50,
            height: 50,
          }}
          contentFit="contain"
        />
        <ThemedText
          style={{
            fontFamily: "Amatic",
            fontSize: 30,
            fontWeight: "condensed",
          }}
        >
          Check your daily tasks
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
});

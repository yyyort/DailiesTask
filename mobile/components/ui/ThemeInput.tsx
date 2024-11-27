import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/lib/constants/Colors";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "password" | "email";
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={
        type === "password"
          ? {
              flexDirection: "row",
            }
          : {}
      }
    >
      <TextInput
        style={[
          {
            color,
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          },
          {
            backgroundColor:
              colorScheme === "dark"
                ? Colors.dark.secondaryBackground
                : Colors.light.secondaryBackground,
          },

          style,
          styles.defaultFont,
        ]}
        {...rest}
        secureTextEntry={type === "password" && !showPassword}
        keyboardType={type === "email" ? "email-address" : "default"}
        placeholderTextColor={
          colorScheme === "dark"
            ? Colors.dark.secondaryText
            : Colors.light.secondaryText
        }
      />
      <Pressable
        style={{
          position: "relative",
          cursor: "pointer",
          zIndex: 10,
        }}
        onPress={() => {
          if (type === "password") {
            setShowPassword(!showPassword);
          }
        }}
      >
        {type === "password" ? (
          showPassword ? (
            <Ionicons name="eye" size={24} color={color} style={styles.eye} />
          ) : (
            <Ionicons
              name="eye-off"
              size={24}
              color={color}
              style={styles.eye}
            />
          )
        ) : null}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "KumbhSans",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  eye: {
    position: "absolute",
    right: 16,
    top: 16,
  },
});

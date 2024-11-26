import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  useColorScheme,
  View,
  type ViewProps,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedPressableProps = PressableProps &
  ViewProps &
  TextProps & {
    lightColor?: string;
    darkColor?: string;
    title?: string;
    textStyles?: TextStyle;
    isSubmitting?: boolean;
    type?: "default" | "primary" | "secondary" | "danger";
  };

export function ThemedButton({
  title,
  textStyles: { ...textStyles } = {},
  isSubmitting,
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedPressableProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorScheme = useColorScheme();

  return (
    <Pressable {...rest}>
      <View
        style={[
          {
            backgroundColor: colorScheme === "dark" ? "#F6F6F6" : "black",
            padding: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          },
          type === "primary" ? styles.primary : undefined,
          type === "secondary" ? styles.secondary : undefined,
          type === "danger" ? styles.danger : undefined,
          style,
        ]}
      >
        <ActivityIndicator
          color={colorScheme === "dark" ? "black" : "white"}
          style={{
            display: isSubmitting ? "flex" : "none",
          }}
        />
        <Text
          style={[
            {
              color: colorScheme === "dark" ? "black" : "white",
              fontSize: 16,
              fontWeight: "bold",
            },
            textStyles,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#FF6347",
  },
  secondary: {
    backgroundColor: "#00BFFF",
  },
  danger: {
    backgroundColor: "#FF0000",
  },
});

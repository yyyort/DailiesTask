import { ThemedView } from "../ui/ThemedView";
import googleLogo from "@/assets/logo/google-logo.svg";
import facebookLogo from "@/assets/logo/facebook-logo.svg";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "../ui/ThemedText";

type socialAuth = {
  image: "string";
  onPress: () => void;
};

export default function SocialAuth() {
  const socialAuth: socialAuth[] = [
    {
      image: googleLogo,
      onPress: () => console.log("google"),
    },
    {
      image: facebookLogo,
      onPress: () => console.log("facebook"),
    },
  ];

  return (
    <ThemedView style={style.socialAuth}>
      {socialAuth.map((item, index) => {
        return (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <Image
              source={item.image}
              style={[
                style.logo,
                item.image === facebookLogo ? {
                    width: 70,
                    height: 70,
                }: null,
              ]}
              contentFit="contain"
            />
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const style = StyleSheet.create({
  socialAuth: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10
  },
  logo: {
    width: 50,
    height: 50,
  },
});

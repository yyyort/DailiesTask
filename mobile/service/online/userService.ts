import { UserCreateType, UserReturnType, UserSignInType } from "@/model/userModel";
import * as SecureStore from "expo-secure-store";
import AsyncStorage, * as AsyncStore from "@react-native-async-storage/async-storage";

const api = 'http://192.168.5.139:4000'; // change this to your server url

export const SignUpApi = async (data: UserCreateType): Promise<void> => {
  try {
    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorMess = await res.json();
      throw new Error(errorMess.message);
    }

    const result = await res.json();
    const refreshToken = res.headers.get("set-cookie")?.split("=")[1];

    if (!refreshToken) {
      throw new Error("Token not found");
    }

    //store tokens in secure store
    await SecureStore.setItemAsync("accessToken", result.accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    //store user in async storage
    await AsyncStorage.setItem("user", JSON.stringify(result.user));

    if (!result.user) {
      throw new Error("User not found");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      throw error;
    }
  }
};

export const SignInApi = async (data: UserSignInType): Promise<void> => {
  try {
    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/api/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorMess = await res.json();
      throw new Error(errorMess.message);
    }

    const result = await res.json();
    const refreshToken = res.headers.get("set-cookie")?.split("=")[1];

    if (!refreshToken) {
      throw new Error("Token not found");
    }

    //store tokens in secure store
    await SecureStore.setItemAsync("accessToken", result.accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    //store user in async storage
    await AsyncStorage.setItem("user", JSON.stringify(result.user));

    if (!result.user) {
      throw new Error("User not found");
    }

  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export const revalidateToken = async (): Promise<void> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken").then((res) => res?.split(";")[0]);

    if (!refreshToken) {
      throw new Error("Token not found");
    }

    const res = await fetch(api + "/api/user/revalidate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to revalidate token");
    }

    const result = await res.json();

    //store tokens in secure store
    await SecureStore.setItemAsync("accessToken", result.accessToken);

  } catch (error) {
    console.log(error);
    throw error;
  }
};
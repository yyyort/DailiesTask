import { UserCreateType, UserSignInType } from "@/model/userModel";
import { config } from "dotenv";
import { getAccessToken, removeAccessToken, removeRefreshToken } from "./authService";


config();
const api = process.env.SERVER_URL ||
  "http://localhost:4000";

export const SignUpApi = async (data: UserCreateType) => {
  try {
    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/api/user/signup", {
      method: "POST",
      credentials: "include",
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

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      throw error;
    }
  }
};

export const SignInApi = async (data: UserSignInType) => {
  try {
    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/api/user/signin", {
      method: "POST",
      credentials: "include",
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

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      throw error;
    }
  }
}

export const SignOutApi = async () => {
  try {
    const accessToken = await getAccessToken();

    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/api/user/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorMess = await res.json();
      throw new Error(errorMess.message);
    }

    //removes cookies
    await removeRefreshToken();
    await removeAccessToken();

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      throw error;
    }

  }
};
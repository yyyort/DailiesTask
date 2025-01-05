import { UserCreateType, UserSignInType } from "@/model/userModel";
import { setAccessToken, setUserData } from "./authService";

const api = process.env.SERVER_URL

export const SignUpApi = async (data: UserCreateType) => {
  try {

    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/user/signup", {
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

    const result: {
      message: string;
      user: {
        email: string;
        id: string;
        name: string;
      };
      accessToken: string;
    } = await res.json();

    if (result) {
      await setAccessToken(
        result.accessToken
      );
      await setUserData(
        result.user
      );

      return result;
    }
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

    const res = await fetch(api + "/user/signin", {
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

    const result: {
      message: string;
      user: {
        email: string;
        id: string;
        name: string;
      };
      accessToken: string;
    } = await res.json();

    if (result) {
      await setAccessToken(
        result.accessToken
      );
      await setUserData(
        result.user
      );

      return result;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      throw error;
    }
  }
}

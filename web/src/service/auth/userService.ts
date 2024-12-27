import { UserCreateType, UserSignInType } from "@/model/userModel";
import { getAccessToken, removeAccessToken, removeRefreshToken, setAccessToken, setUserData } from "./authService";

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
    console.log("api", api);

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

export const SignOutApi = async () => {
  try {
    const accessToken = await getAccessToken();

    if (!api) {
      throw new Error("Server url not found");
    }

    const res = await fetch(api + "/user/logout", {
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
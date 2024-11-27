import { UserCreateType, UserSignInType } from "@/model/userModel";

const api = "http://192.168.5.139:4000"; // change this to your server url

export const SignUpApi = async (data: UserCreateType) => {
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
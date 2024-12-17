import { UserCreateType, UserReturnType, UserSignInType } from "@/model/userModel";
import { revalidateToken, SignInApi, SignUpApi } from "@/service/online/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext } from "react";

type AuthContextType = {
  signIn: (data: UserSignInType) => Promise<UserReturnType | undefined>;
  signUp: (data: UserCreateType) => Promise<UserReturnType | undefined>;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useLayoutEffect(() => {
    setIsLoading(true);

    const checkToken = async () => {
      try {
          await revalidateToken();
      } catch (error) {
        console.log(error);
        // redirect to sign in page
        router.replace("/(auth)/signIn");
      }      

      setIsLoading(false);
    };

    checkToken();

    console.log("check token");
  }, []);

  const signIn = async (
    data: UserSignInType
  ): Promise<UserReturnType | undefined> => {
    try {
      await SignInApi(data);

      // get user from async storage
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        throw new Error("User not found");
      }

      
      setIsAuthenticated(true);

      return JSON.parse(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const signUp = async (data: UserCreateType): Promise<UserReturnType> => {
    try {
      await SignUpApi(data);

      // get user from async storage
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        throw new Error("User not found");
      }

      setIsAuthenticated(true);

      return JSON.parse(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

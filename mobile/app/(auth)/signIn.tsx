import SignInForm from "@/components/auth/signInForm";
import AuthWrapper from "./authWrapper";
import { ScrollView } from "react-native";

export default function SignIn() {
  return (
    <AuthWrapper>
      <SignInForm />
    </AuthWrapper>
  );
}

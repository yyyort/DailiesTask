import SignUpForm from "@/components/auth/signUpForm";
import AuthWrapper from "./authWrapper";

export default function SignUp() {
  return (
    <AuthWrapper>
      <SignUpForm />
    </AuthWrapper>
  );
}

import { ThemedView } from "../ui/ThemedView";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCreateSchema,
  UserCreateType,
  UserSignInSchema,
  UserSignInType,
} from "@/model/userModel";
import { ThemedText } from "../ui/ThemedText";
import { ThemedTextInput } from "../ui/ThemeInput";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedButton } from "../ui/ThemedButton";
import { Colors } from "@/lib/constants/Colors";
import SocialAuth from "./socialAuth";
import { Link, useRouter } from "expo-router";
import { SignUpApi } from "@/service/online/userService";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpForm() {
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserCreateType>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<UserCreateType> = async (data) => {
    try {
      const res = await signUp(data);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Welcome back ${res?.email}`,
        text1Style: { fontSize: 20 },
        text2Style: { fontSize: 15 },
      });

      // redirect to sign in page
      router.replace("/(auth)/signIn");
    } catch (error: unknown) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Something went wrong",
        text1Style: { fontSize: 20 },
        text2Style: { fontSize: 15 },
      });
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <ThemedView style={styles.formContainer}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedView style={styles.textField}>
            <ThemedText type="subtitle" style={styles.textLabel}>
              email
            </ThemedText>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="email@gmail.com"
              style={styles.textForm}
              type="email"
            />
          </ThemedView>
        )}
      />
      {errors.email ? (
        <ThemedText style={styles.textError}>{errors.email.message}</ThemedText>
      ) : null}

      <Controller
        name="password"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedView style={styles.textField}>
            <ThemedText type="subtitle" style={styles.textLabel}>
              password
            </ThemedText>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="password"
              style={styles.textForm}
              type="password"
            />
          </ThemedView>
        )}
      />
      {errors.password ? (
        <ThemedText style={styles.textError}>
          {errors.password.message}
        </ThemedText>
      ) : null}

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedView style={styles.textField}>
            <ThemedText type="subtitle" style={styles.textLabel}>
              confirm password
            </ThemedText>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="password"
              style={styles.textForm}
              type="password"
            />
          </ThemedView>
        )}
      />
      {errors.confirmPassword ? (
        <ThemedText style={styles.textError}>
          {errors.confirmPassword.message}
        </ThemedText>
      ) : null}

      {/* root error */}
      {errors.root ? (
        <ThemedText style={styles.textError}>{errors.root.message}</ThemedText>
      ) : null}

      <ThemedButton
        onPress={handleSubmit(onSubmit)}
        title="sign up"
        isSubmitting={isSubmitting}
        style={styles.submitButton}
        textStyles={{ fontSize: 20 }}
      />

      <SocialAuth />

      <Link
        push
        href={"/(auth)/signIn"}
        style={{
          textDecorationLine: "underline",
          marginTop: 10,
          marginLeft: "auto",
        }}
      >
        <ThemedText
          type="subtitle"
          style={[
            {
              textDecorationLine: "underline",
              marginTop: 10,
              marginLeft: "auto",
            },
          ]}
        >
          already have an account? sign in
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "flex-start",
    gap: 10,
  },
  textField: {
    gap: 5,
  },
  textLabel: {
    fontSize: 20,
  },
  textForm: {
    width: 350,
    height: 60,
    shadowColor: Colors.slate[800],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5,
  },
  textError: {
    color: "red",
    paddingHorizontal: 10,
    marginLeft: "auto",
  },
  submitButton: {
    padding: 10,
    margin: 10,
    height: 60,
    borderRadius: 10,
    borderColor: Colors.slate[400],
    borderBottomWidth: 4,
    borderRightWidth: 4,
    alignItems: "center",
  },
});

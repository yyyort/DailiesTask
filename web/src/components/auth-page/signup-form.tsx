"use client";

import { UserCreateSchema, UserCreateType } from "@/model/userModel";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import SocialAuth from "./social-auth";
import Link from "next/link";
import Image from "next/image";

import loadingSpinner from "@/assets/logo/loading-spinner.svg";
import { SignUpApi } from "@/service/auth/userService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const form = useForm<UserCreateType>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserCreateType> = async (data) => {
    try {
      console.log(data);

      const res = await SignUpApi(data);

      toast({
        title: "Sign up successful",
        description: `Welcome, ${res?.user.email}`,
      });

      //delay for 0.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (res) {
        router.push("/");
      }
    } catch (error: unknown) {
      console.error(error);
      form.setError("root", {
        message: error instanceof Error ? error.message : "An error occurred",
      });

      toast({
        title: "Sign in failed",
        variant: "destructive",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="flex flex-col mb-4">
              <FormItem>
                <FormLabel
                  className="
                    phone-sm:text-xl
                  "
                >
                  email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@email.com"
                    className="
                      shadow-md backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && (
                <div className="text-red-600 text-end">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="name"

          render={({ field, fieldState }) => (
            <div className="flex flex-col mb-4">
              <FormItem>
                <FormLabel
                  className="
                    phone-sm:text-xl
                  "
                >
                  name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="name"
                    className="
                      shadow-md backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && (
                <div className="text-red-600 text-end">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <div className="flex flex-col mb-4">
              <FormItem>
                <FormLabel
                  className="
                    phone-sm:text-xl
                  "
                >
                  password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="password"
                    className="
                      shadow-md backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && (
                <div className="text-red-600 text-end">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <div className="flex flex-col">
              <FormItem>
                <FormLabel
                  className="
                    phone-sm:text-xl
                  "
                >
                  confirm password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="password"
                    className="
                      shadow-md backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && (
                <div className="text-red-600 text-end">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />

        {/* error */}
        {form.formState.errors.root && (
          <div className="text-red-600 text-end">
            {form.formState.errors.root?.message}
          </div>
        )}

        <div className="flex flex-col">
          <Button
            type="submit"
            className="
          my-7 ml-auto h-16
          phone-sm:text-2xl
          laptop:text-3xl laptop:px-10
          border-b-4 border-r-2 border-slate-500
        "
          >
            {form.formState.isSubmitting && (
              <Image
                src={loadingSpinner}
                alt="loading spinner"
                width={20}
                height={20}
              />
            )}
            sign up
          </Button>

          {/* social auth || to be functional*/}
          <SocialAuth />

          <Button
            variant="link"
            type="button"
            className="
          mt-4 ml-auto p-0 text-blue-950 font-semibold
          phone-sm:text-xl
          hover:underline
          "
          >
            <Link href="/signin" className="text-primary">Already have a account? Sign In</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

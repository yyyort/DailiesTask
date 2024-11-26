"use client";

import { UserSignInSchema, UserSignInType } from "@/model/userModel";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import SocialAuth from "./social-auth";
import Link from "next/link";

export default function SignInForm() {
  const form = useForm<UserSignInType>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserSignInType> = async (data) => {
    try {
      console.log(data);
    } catch (error: unknown) {
      console.error(error);
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
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && <div className="text-red-600 text-end bg-white">{fieldState.error.message}</div>}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <div className="flex flex-col">
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
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                  />
                </FormControl>
              </FormItem>

              {/* error */}
              {fieldState.error && <div className="text-red-600 text-end bg-white">{fieldState.error.message}</div>}
            </div>
          )}
        />

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
            sign in
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
            <Link href="/signup">sign up</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

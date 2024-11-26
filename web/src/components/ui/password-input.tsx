"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "./button";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex">
      <Input
        type={showPassword === true ? "text" : "password"}
        ref={ref}
        className={cn(className)}
        {...props}
      />
      <span
        className="relative"
      >
      <Button
        variant="ghost"
        type="button"
        className="flex justify-center items-center absolute right-2"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOpenIcon className="absolute cursor-pointer" />
        ) : (
          <EyeClosedIcon className="absolute cursor-pointer" />
        )}
      </Button>
      </span>
     
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

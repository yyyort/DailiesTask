import React from "react";
import { GalleryVerticalEndIcon } from "lucide-react";
import { SignUpForm } from "./_component/signup-form";

export default function SignUp() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignUpForm />
      </div>
    </div>
  );
}

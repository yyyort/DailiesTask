import SignInForm from "@/components/auth-page/signin-form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import bulbBlack from "@/assets/logo/bulb-black.svg";
import glitter from "@/assets/logo/glitter-black.svg";

import darkGlitter from "@/assets/logo/dark/darkGlitter.svg";
import darkBulb from "@/assets/logo/dark/darkBulb.svg";

export default function SignIn() {
  return (
    <section
      className="relative
       desktop:w-2/5 desktop:ml-auto"
    >
      <h1
        className={cn(
          `
          font-bold justify-self-start self-start
          phone-sm:text-4xl mb-4
          tablet:text-5xl
          
          `
        )}
      >
        DailiesTask
      </h1>
      <Image
        src={glitter}
        alt="bulb"
        width={100}
        height={100}
        className="absolute -z-10 right-14 top-36
            desktop:-right-10 desktop:top-14
            dark:hidden
            block
          "
      />
      <Image
        src={darkGlitter}
        alt="bulb"
        width={100}
        height={100}
        className="absolute -z-10 right-14 top-36
            desktop:-right-10 desktop:top-14
            dark:block
            hidden
          "
      />
      <SignInForm />
      <Image
        src={bulbBlack}
        alt="bulb"
        width={100}
        height={100}
        className="relative -z-10 -left-7 bottom-[17rem]
        dark:hidden
            block
        "
      />
      <Image
        src={darkBulb}
        alt="bulb"
        width={100}
        height={100}
        className="relative -z-10 -left-7 bottom-[17rem]
        dark:block
            hidden
        "
      />
    </section>
  );
}

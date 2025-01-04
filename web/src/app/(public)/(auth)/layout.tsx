import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

import checkbox from "@/assets/logo/checkbox-black.svg";
import progress from "@/assets/logo/progress-black.svg";
import goal from "@/assets/logo/goal-black.svg";

import darkCheckbox from "@/assets/logo/dark/darkCheck.svg";
import darkProgress from "@/assets/logo/dark/darkProgress.svg";
import darkGoal from "@/assets/logo/dark/darkGoal.svg";

import { Amatic_SC } from "next/font/google";

const amatic = Amatic_SC({
  weight: "700",
  style: "normal",
  subsets: ["latin", "latin-ext", "cyrillic", "hebrew", "vietnamese"],
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="
     h-full w-screen
    phone-sm:px-10 phone-sm:flex phone-sm:flex-col phone-sm:justify-center phone-sm:mt-20
    tablet:px-32
    desktop:flex-row-reverse desktop:flex desktop:items-start desktop:mt-20 desktop:px40
    2k:px-56 2k:mt-36
   "
    >
      {children}
      <div
        className="flex flex-col justify-center items-center gap-8
      desktop:ml-40 desktop:mt-20"
      >
        <div className="flex justify-center items-center">
          <Image
            src={checkbox}
            alt="bulb"
            width={100}
            height={100}
            className="
            dark:hidden
            block
            "
          />
          <Image
            src={darkCheckbox}
            alt="bulb"
            width={100}
            height={100}
            className="
             dark:block
            hidden
            "
          />
          <p className={cn("text-[2.5rem]", amatic.className)}>
            Check you task daily
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Image
            src={progress}
            alt="bulb"
            width={100}
            height={100}
            className="
            dark:hidden
            block
            "
          />
          <Image
            src={darkProgress}
            alt="bulb"
            width={100}
            height={100}
            className="
            dark:block
            hidden
            "
          />
          <p className={cn("text-[2.5rem]", amatic.className)}>
            Track your progress
          </p>
        </div>

        <div className="flex justify-center items-center">
          <Image
            src={goal}
            alt="bulb"
            width={100}
            height={100}
            className="
            dark:hidden
            block
            "
          />
          <Image
            src={darkGoal}
            alt="bulb"
            width={100}
            height={100}
            className="
            dark:block
            hidden
            "
          />
          <p className={cn("text-[2.5rem]", amatic.className)}>
            Achieve your goals
          </p>
        </div>
      </div>
    </div>
  );
}

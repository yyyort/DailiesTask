import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

import checkbox from "@/assets/logo/checkbox-black.svg";
import progress from "@/assets/logo/progress-black.svg";
import goal from "@/assets/logo/goal-black.svg";

import { Amatic_SC } from "next/font/google";

const amatic = Amatic_SC({
  weight: "700",
  style: "normal",
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
    phone-sm:px-10 phone-sm:flex phone-sm:flex-col phone-sm:justify-center
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
            className=""
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
            className=""
          />
          <p className={cn("text-[2.5rem]", amatic.className)}>
            Track your progress
          </p>
        </div>

        <div className="flex justify-center items-center">
          <Image src={goal} alt="bulb" width={100} height={100} className="" />
          <p className={cn("text-[2.5rem]", amatic.className)}>
            Achieve your goals
          </p>
        </div>
      </div>
    </div>
  );
}

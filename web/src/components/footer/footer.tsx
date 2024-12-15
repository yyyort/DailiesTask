import Image from "next/image";
import React from "react";
import itLogo from "@/assets/logo/it-logo.png";

export default function Footer() {
  return (
    <div className="flex backdrop-blur-sm p-3 z-30 fixed bottom-0 right-0">
      <div className="flex justify-end items-center w-fit px-10 text-2xl gap-2 bg-slate-100 p-4 rounded-md backdrop-blur-md bg-opacity-20">
        <h1 className="text-lg font-semibold text-slate-600">itdev</h1>
        <Image
          src={itLogo}
          alt="developer-logo"
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>
    </div>
  );
}

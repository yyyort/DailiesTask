import Image from "next/image";
import React from "react";
import itLogo from "@/assets/logo/IT-logo.png";

export default function Footer() {
  return (
    <div className="w-full flex bg-slate-950 backdrop-blur-sm p-3 z-30 fixed bottom-0">
      <div className="flex justify-end items-center w-full px-10 text-2xl gap-2">
        <h1 className="text-2xl font-semibold text-white">itdev</h1>
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

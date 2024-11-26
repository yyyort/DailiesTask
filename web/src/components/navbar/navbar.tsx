import React from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  return (
    <div className="w-full flex bg-slate-100 backdrop-blur-sm bg-opacity-20 p-3 sticky top-0 z-30">
      <HamburgerMenuIcon
        className="size-10
        phone-sm:block
          desktop:hidden
        "
      />
      <div className="flex justify-between items-center w-full px-10 text-2xl
        phone-sm:hidden
        desktop:flex desktop:justify-between desktop:gap-5
      ">
        <h1 className="text-2xl font-semibold">DailiesTask</h1>

        <div>
          <ul className="flex gap-5">
            <li>About</li>
            <li>Pricing</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

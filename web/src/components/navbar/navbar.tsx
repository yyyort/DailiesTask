"use client";

import { ModeToggle } from "../ui/theme-mode-toggle";
import Image from "next/image";
import appLogo from "@/assets/logo/dailiestask-logo.svg";
import Link from "next/link";

const link = [
  {
    section: "About",
    url: "#about",
  },
];

export default function Navbar() {
  return (
    <div className="w-full flex backdrop-blur-sm bg-opacity-20 p-3 fixed top-0 z-30">
      <div
        className="flex justify-between items-center w-full px-10 text-2xl
        phone-sm:hidden
        desktop:flex desktop:justify-between desktop:gap-5
      "
      >
        <div className="flex items-center gap-5">
          <Image src={appLogo} alt="DailiesTask Logo" width={40} height={40} />

          <h1 className="text-2xl font-semibold">DailiesTask</h1>
        </div>

        <div className="flex items-center gap-5">
          {/* nav links */}
          <div className="flex items-center gap-5">
            {link.map(({ section, url }) => (
              <Link key={section} href={url}>
                <p
                  className={`cursor-pointer hover:text-primary transition-colors`}
                >
                  {section}
                </p>
              </Link>
            ))}
          </div>

          {/* theme mode switch */}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

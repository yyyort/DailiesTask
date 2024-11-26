import React from "react";
import { Button } from "../ui/button";
import googleLogo from "@/assets/logo/google-logo.svg";
import faceLogo from "@/assets/logo/facebook-logo.svg";
import Image from "next/image";

type socialAuths = {
  logo: string;
  onClick?: () => void;
};

export default function SocialAuth() {
  const socialAuths: socialAuths[] = [
    {
      logo: googleLogo,
    },
    {
      logo: faceLogo,
    }
  ];

  return (
    <div className="flex gap-3 justify-end items-end py-4">
      {socialAuths.map((socialAuth, index) => (
        <div key={index}>
          <Button variant="outline" className="rounded-full size-14 shadow-md
            laptop:size-20 laptop:rounded-2xl laptop:shadow-lg
          ">
            <Image
              src={socialAuth.logo}
              alt="google-logo"
              width={
                socialAuth.logo === googleLogo ? 30 : 50
              }
              height={30}
            />
          </Button>
        </div>
      ))}
    </div>
  );
}

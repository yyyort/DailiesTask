"use client";
import React from "react";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutApi } from "@/service/auth/authActions";

export default function LogoutButton({
  expanded = true,
}: {
  expanded?: boolean;
}) {
  const router = useRouter();

  return (
    <Button
      className="p-4"
      onClick={async () => {
        try {
          await SignOutApi();

          //redirect to the login page
          router.push("/signin");
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <LogOutIcon />
      {expanded ? "Logout" : ""}
    </Button>
  );
}

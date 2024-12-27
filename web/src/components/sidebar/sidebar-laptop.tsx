"use client";

import { cn } from "@/lib/utils";
import React from "react";
import SidebarLinks from "./sidebar-links";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import LogoutButton from "../auth-page/logout-button";
import { ModeToggle } from "../ui/theme-mode-toggle";
import { getUserData } from "@/service/auth/authService";
import { UserReturnType } from "@/model/userModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function SidebarLaptop() {
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = React.useState<UserReturnType>({} as UserReturnType);

  React.useEffect(() => {
    //fetch user
    const user = async () => {
      try {
        const res = await getUserData();
        setUser(res);
      } catch (error) {
        console.error(error);
      }
    };

    user();
  }, []);

  return (
    <div
      className={cn(
        `flex flex-col h-screen bg-secondary items-center gap-2 justify-between
         transition-all duration-500 ease
        `,
        expanded ? "w-40" : "w-20"
      )}
    >
      {/* header */}
      <div className="flex flex-col gap-20">
        {/* profile */}
        <div className="mt-10">
          <div className="flex flex-row items-center gap-2 overflow-clip">
            <Avatar>
              {/* to change to user profile */}
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {
              expanded && (
                <p>
                  {user.name}
                </p>
              )
            }
          </div>

          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "relative top-8 -right-10 bg-secondary w-10 h-10 rounded-lg flex items-center justify-center",
                expanded ? "-right-28" : ""
              )}
            >
              {expanded ? (
                <ChevronLeftIcon
                  className="w-6 h-6
                  hover:text-green-900 dark:hover:text-green-300 hover:scale-125
                "
                />
              ) : (
                <ChevronRightIcon
                  className="w-6 h-6
                hover:text-green-900 dark:hover:text-green-300 hover:scale-125
              "
                />
              )}
            </button>
            {/* theme */}
            <div className="mb-10">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* body: links */}
        <div className="flex flex-col gap-2">
          <SidebarLinks expanded={expanded} />
        </div>
      </div>

      {/* footer */}
      <div className="mb-20">
        <LogoutButton expanded={expanded} />
      </div>
    </div>
  );
}

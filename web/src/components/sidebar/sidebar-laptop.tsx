"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import SidebarLinks from "./sidebar-links";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import LogoutButton from "../auth-page/logout-button";
import { ModeToggle } from "../ui/theme-mode-toggle";
import { getUserData } from "@/service/authService";
import { UserReturnType } from "@/model/userModel";

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
        "flex flex-col h-screen bg-slate-200 items-center gap-2 justify-between",
        expanded ? "w-40" : "w-20"
      )}
    >
      {/* header */}
      <div className="flex flex-col gap-20">
        {/* profile */}
        <div className="mt-10">
          <div className="flex flex-row items-center gap-2 overflow-clip">
            <p>{user.name}</p>
          </div>

          <div>
            <Button
              onClick={() => setExpanded(!expanded)}
              variant={"outline"}
              className={cn(
                "relative top-8 -right-10 bg-slate-200",
                expanded ? "-right-24" : ""
              )}
            >
              {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
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

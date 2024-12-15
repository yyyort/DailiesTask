"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import SidebarLinks from "./sidebar-links";
import { ChevronLeftIcon, ChevronRightIcon, LogOutIcon } from "lucide-react";

export default function SidebarLaptop() {
  const [expanded, setExpanded] = React.useState(false);

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
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-300 rounded-full border-2 border-slate-400" />
            {expanded && <p>user</p>}
          </div>

          <Button
            onClick={() => setExpanded(!expanded)}
            variant={"outline"}
            className={cn(
              "relative top-0 -right-10 bg-slate-200",
              expanded ? "-right-24" : ""
            )}
          >
            {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Button>
        </div>

        {/* body: links */}
        <div className="flex flex-col gap-2">
          <SidebarLinks expanded={expanded} />
        </div>
      </div>

      {/* footer */}
      <div className="mb-20">
        <Button variant={"outline"}>
          <LogOutIcon />
          {expanded && <p>Logout</p>}
        </Button>
      </div>
    </div>
  );
}

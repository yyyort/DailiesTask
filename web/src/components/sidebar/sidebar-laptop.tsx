"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import SidebarLinks from "./sidebar-links";

export default function SidebarLaptop() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-col w-10 h-screen bg-slate-200",
        expanded ? "w-40" : "w-10"
      )}
    >
      <Button onClick={() => setExpanded(!expanded)}>
        <ChevronLeftIcon />
      </Button>

      <div className="flex flex-col gap-2">
        <SidebarLinks />
      </div>
    </div>
  );
}

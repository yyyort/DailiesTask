"use client";
import { HouseIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";

type Sidebarlinks = {
  name: string;
  href: string;
  icon: JSX.Element;
  onClick?: () => void;
};

export default function SidebarLinks({ expanded }: { expanded: boolean }) {
  const router = useRouter();

  const links: Sidebarlinks[] = [
    {
      name: "home",
      href: "/",
      icon: <HouseIcon />,
      onClick: () => router.push("/"),
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <ListTodoIcon />,
      onClick: () => router.push("/tasks"),
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md"
          onClick={link.onClick}
        >
          <div className="flex p-2 gap-2">
            {link.icon}
            {expanded && <p>{link.name}</p>}
          </div>
        </Link>
      ))}
    </>
  );
}

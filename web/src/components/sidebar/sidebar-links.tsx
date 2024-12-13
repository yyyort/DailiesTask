import { HouseIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Sidebarlinks = {
  name: string;
  href: string;
  icon: JSX.Element;
  onClick?: () => void;
};

export default function SidebarLinks() {
  const links: Sidebarlinks[] = [
    {
      name: "home",
      href: "/",
      icon: <HouseIcon />,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <ListTodoIcon />,
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="flex items-center justify-center w-10 h-10 bg-slate-200 hover:bg-slate-300"
          onClick={link.onClick}
        >
          {link.icon}
        </Link>
      ))}
    </>
  );
}

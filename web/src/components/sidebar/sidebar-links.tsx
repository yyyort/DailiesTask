"use client";
import { cn } from "@/lib/utils";
import {
  HouseIcon,
  ListCheckIcon,
  PenLineIcon,
  SquareCheckBigIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Sidebarlinks = {
  name: string;
  href: string;
  icon: JSX.Element;
  onClick?: () => void;
};

export default function SidebarLinks({
  expanded,
  variant,
}: {
  expanded: boolean;
  variant?: "mobile" | "desktop";
}) {
  const router = useRouter();
  const pathName = usePathname();

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
      icon: <SquareCheckBigIcon />,
      onClick: () => router.push("/tasks"),
    },
    {
      name: "Routines",
      href: "/routines",
      icon: <ListCheckIcon />,
    },
    {
      name: "Notes",
      href: "/notes",
      icon: <PenLineIcon />,
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "flex items-center hover:bg-slate-300 rounded-md",
            variant === "mobile" && "p-2 justify-start w-full",
            pathName === link.href && "underline",
            pathName === link.href && expanded && "bg-slate-300"
          )}
          onClick={link.onClick}
        >
          <div
            className={cn(
              "flex p-2 gap-2",
              variant === "mobile" && "w-full",
              pathName === link.href && !expanded && "bg-slate-300 rounded-md"
            )}
          >
            {link.icon}
            {expanded && <p>{link.name}</p>}
          </div>
        </Link>
      ))}
    </>
  );
}

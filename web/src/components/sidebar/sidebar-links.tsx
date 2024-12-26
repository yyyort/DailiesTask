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
      icon: <HouseIcon className={
        cn(
          pathName === "/" && "text-green-700 dark:text-green-300"
        )
      }/>,
      onClick: () => router.push("/"),
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <SquareCheckBigIcon className={
        cn(
          pathName === "/tasks" && "text-green-700 dark:text-green-300"
        )
      }/>,
      onClick: () => router.push("/tasks"),
    },
    {
      name: "Routines",
      href: "/routines",
      icon: <ListCheckIcon className={
        cn(
          pathName === "/routines" && "text-green-700 dark:text-green-300"
        )
      }/>,
    },
    {
      name: "Notes",
      href: "/notes",
      icon: <PenLineIcon className={
        cn(
          pathName === "/notes" && "text-green-700 dark:text-green-300"
        )
      }/>,
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            `flex items-center rounded-md
            hover:bg-card
            transition-all duration-200 ease-in-out
            `,
            expanded ? "w-full" : "w-fit",
            variant === "mobile" && "p-2 justify-start w-full",
            pathName === link.href && "underline",
            pathName === link.href && expanded && "bg-card w-full"
          )}
          onClick={link.onClick}
        >
          <div
            className={cn(
              "flex p-2 gap-2",
              variant === "mobile" && "w-full",
              pathName === link.href && !expanded && "bg-card rounded-md"
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

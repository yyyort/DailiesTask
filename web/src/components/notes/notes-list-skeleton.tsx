import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function NotesListSkeleton() {
  return (
    <div
      className="grid
        phone:grid-cols-1
        tablet:grid-cols-2
        laptop:grid-cols-3
        2k:grid-cols-4
        gap-4
        px-10
        "
    >
      <Skeleton className="laptop:h-[400px] laptop:w-[400px] phone-sm:h-[200px] phone-sm:w-[200px]" />
      <Skeleton className="laptop:h-[400px] laptop:w-[400px] phone-sm:h-[200px] phone-sm:w-[200px]" />
      <Skeleton className="laptop:h-[400px] laptop:w-[400px] phone-sm:h-[200px] phone-sm:w-[200px]" />
      <Skeleton className="laptop:h-[400px] laptop:w-[400px] phone-sm:h-[200px] phone-sm:w-[200px]" />
    </div>
  );
}

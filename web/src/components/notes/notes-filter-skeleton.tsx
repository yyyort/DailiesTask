import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function NotesFilterSkeleton() {
  return (
    <div className="flex flex-row gap-2">
      <Skeleton
        className="
            laptop:w-50 laptop:h-10
            phone-sm:w-40
            "
      />
      <Skeleton
        className="
            laptop:w-50 laptop:h-10
            phone-sm:w-40
            "
      />
      <Skeleton
        className="
            laptop:w-50 laptop:h-10
            phone-sm:w-40
            "
      />
    </div>
  );
}

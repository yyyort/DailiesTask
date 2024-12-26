import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function RoutineListsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 laptop:gap-4">
      <Skeleton
        className="
        laptop:h-[200px] laptop:w-[500px]
        phone-sm:h-[120px] phone-sm:w-[360px]
        "
      />
      <Skeleton
        className="
        laptop:h-[200px] laptop:w-[500px]
        phone-sm:h-[120px] phone-sm:w-[360px]
        "
      />
      <Skeleton
        className="
        laptop:h-[200px] laptop:w-[500px]
        phone-sm:h-[120px] phone-sm:w-[360px]
        "
      />
    </div>
  );
}

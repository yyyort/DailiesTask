import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TasksLaptopSkeleton() {
  return (
    <div
      className="
           grid
           laptop:grid-cols-2
           desktop:grid-cols-3
           gap-x-8
           gap-y-4
       "
    >
      <div>
        <h2
          className="
                   text-2xl text-foreground font-semibold mb-3
               "
        >
          To do
        </h2>
        <div className="grid gap-3">
          <Skeleton className="w-[500px] h-[100px]" />
          <Skeleton className="w-[500px] h-[100px]" />
          <Skeleton className="w-[500px] h-[100px]" />
          <Skeleton className="w-[500px] h-[100px]" />
        </div>
      </div>
      <div>
        <h2
          className="
                   text-2xl text-foreground font-semibold mb-3
               "
        >
          Done
        </h2>
        <div className="grid gap-3">
          <Skeleton className="w-[500px] h-[100px]" />
          <Skeleton className="w-[500px] h-[100px]" />
        </div>
      </div>
      <div>
        <h2
          className="
                   text-2xl text-foreground font-semibold mb-3
               "
        >
          Overdue
        </h2>
        <Skeleton className="w-[500px] h-[100px]" />
      </div>
    </div>
  );
}

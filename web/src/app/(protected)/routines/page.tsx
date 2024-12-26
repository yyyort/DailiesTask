import RoutineAddButton from "@/components/routines/routine-add-button";

import RoutineFilter from "@/components/routines/routine-filters";

import React, { Suspense } from "react";
import RoutineList from "./routineList";
import RoutineListsSkeleton from "@/components/routines/routine-lists-skeleton";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Routines(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const filterParams = searchParams.filter as string;

  return (
    <div
      className="h-screen w-full flex flex-col overflow-auto
    phone-sm:px-10 phone-sm:py-10"
    >
      {/* 
          headers
      */}
      <div className="text-2xl font-bold text-end">
        <h1>Routines</h1>
      </div>

      {/* 
          add routine
      */}
      <div className="ml-auto my-2">
        <RoutineAddButton />
      </div>

      {/* 
          filters
      */}
      <div
        className="
        mt-4 mb-3 overflow-x-auto
        phone-sm:mr-auto
        "
      >
        <RoutineFilter />
      </div>

      {/* 
          routines container
      */}
      <Suspense fallback={<RoutineListsSkeleton />}>
        <RoutineList filterParams={filterParams} />
      </Suspense>
    </div>
  );
}

import RoutineAddButton from "@/components/routines/routine-add-button";
import RoutineContainer from "@/components/routines/routine-container";
import RoutineFilter from "@/components/routines/routine-filters";
import { RoutineReturnType } from "@/model/routine.model";
import { routineGetService } from "@/service/routineService";

import React, { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Routines(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const filterParams = searchParams.filter as string;

  console.log(filterParams);

  const routines: RoutineReturnType[] = await routineGetService(filterParams);
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
      <div
        className="grid gap-4
      phone-sm:grid-cols-1
      tablet:grid-cols-2
      laptop:grid-cols-3 laptop:gap-6
      "
      >
        <Suspense fallback={<div>Loading...</div>}>
          {routines.map((routine) => (
            <RoutineContainer key={routine.id} routine={routine} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

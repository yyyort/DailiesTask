import RoutineContainer from "@/components/routines/routine-container";
import { RoutineReturnType } from "@/model/routine.model";
import { routineGetAllService } from "@/service/routines/routineService";

import React from "react";

export default async function RoutineList({
  filterParams,
}: {
  filterParams: string;
}) {
  console.log(filterParams);

  const routines: RoutineReturnType[] = await routineGetAllService(
    filterParams
  );

  return (
    <div
      className="grid gap-4
         phone-sm:grid-cols-1
         tablet:grid-cols-2
         laptop:grid-cols-3 laptop:gap-6
         "
    >
      {routines.map((routine) => (
        <RoutineContainer key={routine.id} routine={routine} />
      ))}
    </div>
  );
}

import React from "react";
import RoutineFilter, { routineFilterT } from "./routine-filters";
import { routineGetHeadersService } from "@/service/routines/routineService";

export default async function RoutineFiltersList() {
  const routines: routineFilterT[] = await routineGetHeadersService();

  return <RoutineFilter routines={routines} />;
}

"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";
import { routineGetHeadersService } from "@/service/routineService";

export type routineFilterT = {
  id: string;
  title: string;
};

export default function RoutineFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [routines, setRoutines] = React.useState<routineFilterT[]>([]);

  React.useEffect(() => {
    const getRoutines = async () => {
      const res = await routineGetHeadersService();
      setRoutines(res);
    };
    getRoutines();
  }, []);

  return (
    <>
      <ToggleGroup
        type="multiple"
        defaultValue={
          searchParams.has("filter")
            ? (searchParams.get("filter") || "").split("-")
            : ["all"]
        }
        value={
          searchParams.has("filter")
            ? (searchParams.get("filter") || "").split("-")
            : ["all"]
        }
        onValueChange={
          // if all is selected, other values are removed
          (value) => {
            // update the search params
            const newParams = new URLSearchParams();

            // if all is selected, remove the filter param
            if (value.includes("all") && searchParams.has("filter")) {
              newParams.delete("filter");
            } else {
              const filterValue = value.filter((v) => v !== "all");

              newParams.set("filter", filterValue.join("-"));
            }

            // navigate to the new url
            router.push(`?${newParams.toString()}`);
          }
        }
        className="flex flex-row gap-2 mb-3"
        variant={"default"}
      >
        <ToggleGroupItem
          value="all"
          className="
        phone-sm:text-lg data-[state=on]:bg-black data-[state=on]:text-white
        "
        >
          All
        </ToggleGroupItem>
        {routines.map((routine) => {
          return (
            <ToggleGroupItem
              value={routine.title}
              key={routine.id}
              className="phone-sm:text-lg data-[state=on]:bg-black data-[state=on]:text-white"
            >
              {routine.title}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </>
  );
}

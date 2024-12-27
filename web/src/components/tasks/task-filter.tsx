"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";

export default function TaskFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <>
      <ToggleGroup
        type="multiple"
        defaultValue={
          searchParams.has("filter")
            ? (searchParams.get("filter") || "").split(" ")
            : ["all"]
        }
        value={
          searchParams.has("filter")
            ? (searchParams.get("filter") || "").split(" ")
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
            } else if (
              value.includes("todo") ||
              value.includes("done") ||
              value.includes("overdue")
            ) {
              const filterValue = value.filter((v) => v !== "all");

              newParams.set("filter", filterValue.join(" "));
            }

            //check if there already is a date
            if (searchParams.get("date")) {
              newParams.set("date", searchParams.get("date")!);
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
        phone-sm:text-lg data-[state=on]:bg-primary data-[state=on]:text-white
        "
        >
          All
        </ToggleGroupItem>
        <ToggleGroupItem
          value="todo"
          className="
        phone-sm:text-lg data-[state=on]:bg-primary data-[state=on]:text-white
        "
        >
          todo
        </ToggleGroupItem>
        <ToggleGroupItem
          value="done"
          className="
        phone-sm:text-lg data-[state=on]:bg-primary data-[state=on]:text-white
        "
        >
          done
        </ToggleGroupItem>
        <ToggleGroupItem
          value="overdue"
          className="
        phone-sm:text-lg data-[state=on]:bg-primary data-[state=on]:text-white
        "
        >
          overdue
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}

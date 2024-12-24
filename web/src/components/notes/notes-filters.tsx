"use client";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";

type NotesFilterType = {
  id: string;
  name: string;
};

export default function NotesFilter() {
  const mockFilters: NotesFilterType[] = [
    {
      id: "groceries",
      name: "groceries",
    },
    {
      id: "class note",
      name: "class note",
    },
    {
      id: "important",
      name: "important",
    },
  ];

  const filters = mockFilters;

  const searchParams = useSearchParams();
  const router = useRouter();

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
      phone-sm:text-sm data-[state=on]:bg-black data-[state=on]:text-white
      laptop:text-lg
      "
        >
          All
        </ToggleGroupItem>
        {filters.map((routine) => {
          return (
            <ToggleGroupItem
              value={routine.name}
              key={routine.id}
              className="phone-sm:text-lg data-[state=on]:bg-black data-[state=on]:text-white"
            >
              <div
                className="
          phone-sm:block text-sm
          laptop:text-lg
                "
              >
                {
                  //limit the length of the routine name to 10 characters
                  routine.name.length > 10
                    ? routine.name.substring(0, 10) + "..."
                    : routine.name
                }
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </>
  );
}

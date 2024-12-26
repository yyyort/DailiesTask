"use client";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";
import { notesGetGroupsService } from "@/service/noteService";
import { FilterIcon } from "lucide-react";

type NotesFilterType = {
  id: string;
  name: string;
};

export default function NotesFilter() {
  const [groups, setGroups] = React.useState<NotesFilterType[]>([]);

  React.useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await notesGetGroupsService();

        console.log("in filter", res);

        if (!res) {
          return;
        }

        setGroups(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <>
      <div
        className="p-2"
      >
        <FilterIcon className="w-6 h-6" />
      </div>
      <ToggleGroup
        type="multiple"
        defaultValue={
          searchParams.has("groups")
            ? (searchParams.get("groups") || "").split("-")
            : ["all"]
        }
        value={
          searchParams.has("groups")
            ? (searchParams.get("groups") || "").split("-")
            : ["all"]
        }
        onValueChange={
          // if all is selected, other values are removed
          (value) => {
            // update the search params
            const newParams = new URLSearchParams();

            // if all is selected, remove the filter param
            if (value.includes("all") && searchParams.has("groups")) {
              newParams.delete("groups");
            } else {
              const filterValue = value.filter((v) => v !== "all");

              newParams.set("groups", filterValue.join("-"));
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
        {groups.map((group) => {
          return (
            <ToggleGroupItem
              value={group.name}
              key={group.id}
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
                  group.name.length > 10
                    ? group.name.substring(0, 10) + "..."
                    : group.name
                }
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </>
  );
}

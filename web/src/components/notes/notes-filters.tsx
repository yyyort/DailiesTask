"use client";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";
import {
  notesGetGroupsService,
  notesPostGroupService,
} from "@/service/noteService";
import { MultiSelect } from "../ui/multi-select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

type NotesFilterType = {
  id: string;
  name: string;
};

export default function NotesFilter() {
  const [groups, setGroups] = React.useState<NotesFilterType[]>([]);
  const [newGroup, setNewGroup] = React.useState("");

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
    <div className="flex gap-2 items-end">
      <div className="p-2">
        <MultiSelect
          variant={"filter"}
          options={groups.map((group) => {
            return {
              label: group.name,
              value: group.name,
            };
          })}
          onValueChange={(value) => {
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
          }}
          value={
            searchParams.has("groups")
              ? (searchParams.get("groups") || "").split("-")
              : []
          }
        >
          <div className="flex items-center gap-2 p-1">
            <Input
              type="text"
              placeholder="New Group"
              className="
                    shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                    phone-sm:text-sm p-2
                  "
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();

                    //if newGroup is already in the groups, return
                    if (groups.find((group) => group.name === newGroup)) {
                      console.log("group already exists");
                      return;
                    }
                  }}
                  size="sm"
                  className="h-8 px-2"
                >
                  <PlusCircledIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex flex-col items-end justify-start w-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Add New Group{" "}
                    <span>
                      <strong>{newGroup}</strong>
                    </span>
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="text-sm font-medium"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async (event) => {
                      event.stopPropagation();

                      //if newGroup is already in the groups, return
                      if (groups.find((group) => group.name === newGroup)) {
                        console.log("group already exists");
                        return;
                      } else {
                        try {
                          await notesPostGroupService(newGroup);
                        } catch (error) {
                          console.error(error);
                        }
                      }
                    }}
                  >
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </MultiSelect>
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
    </div>
  );
}

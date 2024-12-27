"use client";

import { NoteCreateSchema, NoteCreateType } from "@/model/notes.model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MultiSelect } from "../ui/multi-select";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { PinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { notesPostService } from "@/service/notes/notesAction";
import { useRouter } from "next/navigation";
import { Tiptap } from "./tiptap-richtext/tiptap";
import { notesGetGroupsService } from "@/service/notes/noteService";
import DOMPurify from "dompurify";

export default function NotesAddForm() {
  const [groups, setGroups] = React.useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  //fetch groups
  React.useEffect(() => {
    const fetchGroups = async () => {
      const response = await notesGetGroupsService();
      setGroups(
        response.map((group) => ({
          value: group.name,
          label: group.name,
        }))
      );
    };

    fetchGroups();
  }, []);

  const [newGroup, setNewGroup] = React.useState<string>("");

  const handleAddGroup = (group: string) => {
    //handle only if group is not in groups
    const exist: boolean = groups.some((gr) => gr.label === group);

    console.log("exist", exist);

    if (!exist) {
      setGroups([...groups, { value: group, label: group }]);
      setNewGroup("");
    }

    setNewGroup("");
  };

  React.useEffect(() => {
    // fetch groups
    setGroups(
      ["important", "others"].map((group) => ({ value: group, label: group }))
    );
  }, []);

  const form = useForm<NoteCreateType>({
    resolver: zodResolver(NoteCreateSchema),
    defaultValues: {
      title: "",
      content: "",
      pinned: false,
      group: [],
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<NoteCreateType> = async (data) => {
    try {
      console.log("insubmit", data);

      //dom purify data content
      const cleanContent = DOMPurify.sanitize(data.content);
      const cleanData: NoteCreateType = {
        ...data,
        content: cleanContent,
      };

      await notesPostService(cleanData);

      form.reset();

      //reroute to /notes
      router.push("/notes");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          console.log("redirect to sign in");
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 h-full overflow-y-auto py-5
          phone-sm:px-5
          laptop:px-10
          "
        >
          <div className="flex flex-row w-full gap-2 items-end">
            {/* select groups */}
            <FormField
              control={form.control}
              name="group"
              render={({ field, fieldState }) => (
                <div
                  className="flex flex-col
                phone-sm:w-full
                laptop:w-fit
                "
                >
                  <FormItem>
                    <MultiSelect
                      options={groups}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      placeholder="Select Group"
                      maxCount={3}
                    >
                      <div className="flex items-center gap-2 p-1">
                        <Input
                          type="text"
                          placeholder="New Group"
                          className={`
                    shadow-md z-10 backdrop-filter backdrop-blur-sm text-foreground
                    phone-sm:text-sm p-2`}
                          value={newGroup}
                          onChange={(e) => setNewGroup(e.target.value)}
                        />
                        <Button
                          onClick={() => handleAddGroup(newGroup)}
                          size="sm"
                          className="h-8 px-2"
                        >
                          <PlusCircledIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </MultiSelect>

                    {/* new group */}
                  </FormItem>

                  {fieldState.error && (
                    <div className="text-red-600 text-end">
                      {fieldState.error.message}
                    </div>
                  )}
                </div>
              )}
            />

            {/* pinned */}
            <FormField
              control={form.control}
              name="pinned"
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <FormItem>
                    <FormLabel
                      className="
                    phone-sm:text-xl
                    text-slate-500
                  "
                    ></FormLabel>
                    <FormControl>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={cn("phone-sm:text-2xl p-2 bg-background")}
                      >
                        <PinIcon
                          className={cn(
                            "h-6 w-6",
                            field.value
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </FormControl>
                  </FormItem>

                  {/* error */}
                  {fieldState.error && (
                    <div className="text-red-600 text-end">
                      {fieldState.error.message}
                    </div>
                  )}
                </div>
              )}
            />

            {/* submit button */}
            <Button
              type="submit"
              className="text-xl py-6 mt-auto ml-auto
          phone-sm:hidden
          laptop:flex
          "
            >
              Add Note
            </Button>
          </div>

          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <FormItem>
                  <FormLabel
                    className="
                    phone-sm:text-xl
                  "
                  ></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="title"
                      className="
                      shadow-md -10 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          {/* content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <div className="flex flex-col mb-4">
                <FormItem>
                  <FormLabel
                    className="
                    phone-sm:text-xl
               
                  "
                  ></FormLabel>
                  <FormControl>
                    <Tiptap
                      {...field}
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          {/* root error */}
          {form.formState.errors && (
            <div className="text-red-600 text-end">
              {form.formState.errors.root?.message}
            </div>
          )}

          {/* submit */}
          {/* submit button */}
          <Button
            type="submit"
            className="text-2xl py-7 mt-auto ml-auto
          phone-sm:flex
          laptop:hidden
          "
          >
            Add Note
          </Button>
        </form>
      </Form>
    </>
  );
}

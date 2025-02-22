"use client";

import {
  NoteType,
  NoteUpdateSchema,
  NoteUpdateType,
} from "@/model/notes.model";
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
import { useRouter } from "next/navigation";
import { Tiptap } from "./tiptap-richtext/tiptap";
import { notesGetGroupsService } from "@/service/notes/noteService";
import { notesUpdateService } from "@/service/notes/notesAction";
import DOMPurify from "dompurify";

export default function NotesEditForm({ note }: { note: NoteType }) {
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

  const form = useForm<NoteUpdateType>({
    resolver: zodResolver(NoteUpdateSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      pinned: note.pinned,
      group: note.group.map((group) => group.name),
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<NoteUpdateType> = async (data) => {
    console.log("insubmit", data);
    try {
      const cleanContent = DOMPurify.sanitize(data?.content ?? "");
      const cleanData: NoteUpdateType = {
        ...data,
        content: cleanContent,
      };

      await notesUpdateService(note.id, cleanData);

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
                      defaultValue={field.value}
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
                    <div className="text-red-600 text-end bg-primary">
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
                    <div className="text-red-600 text-end bg-primary">
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
              Edit Note
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
                    text-slate-500
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
                  <div className="text-red-600 text-end bg-primary">
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
                    text-slate-500
                  "
                  ></FormLabel>
                  <FormControl>
                    <Tiptap
                      {...field}
                      content={field?.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end bg-primary">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          {/* root error */}
          {form.formState.errors && (
            <div className="text-red-600 text-end bg-primary">
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
            Edit Note
          </Button>
        </form>
      </Form>
    </>
  );
}

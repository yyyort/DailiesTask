"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskCreateSchema, TaskCreateType } from "@/model/task.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { taskCreateService } from "@/service/taskService";
import { Textarea } from "../ui/textarea";

export default function TaskAddForm({
  setSheetOpen,
}: {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<TaskCreateType>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      timeToDo: new Date().toLocaleTimeString(
        navigator.language,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).split(" ")[0], //hh:mm format
      deadline: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit: SubmitHandler<TaskCreateType> = async (data) => {
    try {
      // call the service to create a task
      console.log(data);

      await taskCreateService(data);

      // clear the form
      form.reset();

      // close the sheet
      setSheetOpen(false);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          // redirect to sign in
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
          className="flex flex-col h-full"
        >
          <FormField
            control={form.control}
            name="title"
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
                    <Input
                      {...field}
                      type="text"
                      placeholder="title"
                      className="
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end bg-white">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="timeToDo"
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
                    <Input
                      {...field}
                      type="time"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      className="
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end bg-white">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
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
                    <Input
                      {...field}
                      type="date"
                      value={field.value}
                      onChange={field.onChange}
                      className="
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-14
                    "
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end bg-white">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="description"
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
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder="description"
                      onChange={field.onChange}
                      className="
                      shadow-md fill-white z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 phone-sm:h-32
                      tablet:h-[20rem]
                    "
                    />
                  </FormControl>
                </FormItem>

                {/* error */}
                {fieldState.error && (
                  <div className="text-red-600 text-end bg-white">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          <Button
            className="
            phone-sm:text-xl
            p-6 ml-auto mt-auto
            "
          >
            Add Task
          </Button>
        </form>
      </Form>
    </>
  );
}

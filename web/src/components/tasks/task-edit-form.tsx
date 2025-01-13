"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  TaskReturnType,
  TaskUpdateSchema,
  TaskUpdateType,
} from "@/model/task.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { taskUpdateService } from "@/service/tasks/taskActions";

export default function TaskEditForm({
  setSheetOpen,
  task,
}: {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskReturnType;
}) {
  const form = useForm<TaskUpdateType>({
    resolver: zodResolver(TaskUpdateSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      timeToDo: task.timeToDo,
      deadline: task.deadline,
      order: task.order,
    },
  });

  const onSubmit: SubmitHandler<TaskUpdateType> = async (data) => {
    try {
      // call the service to create a task
      console.log(data);

      await taskUpdateService(task.id, data);

      // clear the form
      form.reset();

      // close the sheet
      setSheetOpen(false);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          // redirect to sign in
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
                      shadow-md backdrop-filter backdrop-blur-sm
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

          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <div className="flex flex-col mb-4">
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-2xl p-4 h-14">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo" className="text-2xl p-4 h-14">
                        todo
                      </SelectItem>
                      <SelectItem value="done" className="text-2xl p-4 h-14">
                        done
                      </SelectItem>
                      <SelectItem value="overdue" className="text-2xl p-4 h-14">
                        overdue
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

          <FormField
            control={form.control}
            name="timeToDo"
            render={({ field, fieldState }) => (
              <div className="flex flex-col mb-4">
                <FormItem>
                  <FormLabel
                    className="
                    phone-sm:text-xl
                  "
                  ></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      value={
                        //transform timeToDo if format is hh:mm to hh:mm:ss
                        field.value?.length === 5
                          ? field.value + ":00"
                          : field.value
                      }
                      onChange={field.onChange}
                      className="
                      shadow-md backdrop-filter backdrop-blur-sm
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

          <FormField
            control={form.control}
            name="deadline"
            render={({ field, fieldState }) => (
              <div className="flex flex-col mb-4">
                <FormItem>
                  <FormLabel
                    className="
                    phone-sm:text-xl
                  "
                  ></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value}
                      onChange={field.onChange}
                      className="
                      shadow-md backdrop-filter backdrop-blur-sm
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

          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <div className="flex flex-col mb-4">
                <FormItem>
                  <FormLabel
                    className="
                    phone-sm:text-xl
      
                  "
                  ></FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder="description"
                      onChange={field.onChange}
                      className="
                      shadow-md backdrop-filter backdrop-blur-sm
                      phone-sm:text-2xl p-4 h-32
                      tablet:h-[20rem]
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

          <Button
            className="
            phone-sm:text-xl
            p-6 ml-auto mt-auto
            "
          >
            update
          </Button>
        </form>
      </Form>
    </>
  );
}

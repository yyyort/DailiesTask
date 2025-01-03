"use client";

import { RoutineAddSchema, RoutineCreateType } from "@/model/routine.model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Textarea } from "../ui/textarea";
import { Plus, X } from "lucide-react";
import { routineAddService } from "@/service/routines/routineActions";

export default function RoutineAddForm({
  setSheetOpen,
}: {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const localTime = new Date()
    .toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .split(" ")[0]; //hh:mm format
  const localDate = new Date().toISOString().split("T")[0];

  const form = useForm<RoutineCreateType>({
    resolver: zodResolver(RoutineAddSchema),
    defaultValues: {
      title: "",
      description: "",
      tasks: [
        {
          title: "",
          deadline: localDate,
          timeToDo: localTime, //hh:mm format
          status: "todo",
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<RoutineCreateType> = async (data) => {
    try {
      await routineAddService(data);

      form.reset();

      setSheetOpen(false);
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full gap-4"
        >
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

          {/* description */}
          <Accordion type="single" collapsible className="mb-2 mx-2">
            <AccordionItem value="Description">
              <AccordionTrigger
                className="
              phone-sm:text-xl
              "
              >
                Description
              </AccordionTrigger>
              <AccordionContent>
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
                      phone-sm:text-2xl p-4 phone-sm:h-32
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* tasks */}
          <div className="flex flex-col gap-3">
            {fields.map((fields, index) => (
              <div
                key={fields.id}
                className="flex flex-row justify-between gap-2"
              >
                <div
                  className="flex w-full
                 phone-sm:flex-col phone-sm:gap-1
                 laptop:flex-row laptop:gap-6
                 "
                >
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.title`}
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
                              placeholder="task title"
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
                    name={`tasks.${index}.timeToDo`}
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
                            phone-sm:text-2xl h-14
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
                </div>

                <button onClick={() => remove(index)} type="button">
                  <X className="text-primary" />
                </button>
              </div>
            ))}
          </div>

          {/* root error */}
          {form.formState.errors.root && (
            <div className="text-red-600 text-end">
              {form.formState.errors.root.message}
            </div>
          )}


          {/* add task button*/}
          <Button
            type="button"
            onClick={() =>
              append({
                title: "",
                deadline: localDate,
                timeToDo: localTime,
                status: "todo",
              })
            }
            className="text-2xl py-7 hover:border-black hover:border-2"
            variant={"secondary"}
          >
            <Plus className="text-primary" />
            Add Task
          </Button>

          {/* submit button */}
          <Button type="submit" className="text-2xl py-7 mt-auto">
            Add Routine
          </Button>
        </form>
      </Form>
    </>
  );
}

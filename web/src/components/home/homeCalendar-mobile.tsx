"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskCalendar } from "../ui/taskCalendar";
import { taskGetEverythingService } from "@/service/taskService";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";

export default function HomeCalendarMobile() {
  const [tasks, setTasks] = React.useState<{ id: string; date: Date }[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await taskGetEverythingService();

        setTasks(res);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        }

        setTasks([]);
      }
    };
    fetchData();
  }, []);

  const seachParams = useSearchParams();
  const router = useRouter();

  const date = seachParams.get("date") ?? new Date().toLocaleDateString();
  const onDateChange = (date: Date | undefined) => {
    if (!date) return;
    const newParams = new URLSearchParams();
    newParams.set("date", date.toLocaleDateString());
    router.push(`?${newParams.toString()}`);

    setSelectedDate(date);
  };

  const hasEvent = (day: Date) =>
    tasks.some((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 p-2 rounded-md border w-full"
            )}
          >
            <ChevronDownIcon className="w-6 h-6" />
            <p className="text-sm">
              {selectedDate?.toDateString() === new Date().toDateString()
                ? "Today"
                : selectedDate?.toDateString()}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex">
            <TaskCalendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={onDateChange}
              className="sclae-125 "
              modifiers={{ hasEvent: hasEvent }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: "bold",
                },
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {date.getDate()}
                    {hasEvent(date) && (
                      <div
                        className={cn(
                          "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 rounded-full",
                          date.toDateString() === selectedDate?.toDateString()
                            ? "bg-white"
                            : "bg-slate-600"
                        )}
                      />
                    )}
                  </div>
                ),
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

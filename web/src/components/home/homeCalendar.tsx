"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskCalendar } from "../ui/taskCalendar";
import { taskGetEverythingService } from "@/service/taskService";
import { cn } from "@/lib/utils";

export default function HomeCalendar() {
  const [tasks, setTasks] = React.useState<{ id: string; date: Date }[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

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
    <div className="flex relative m-10 w-fit">
      <TaskCalendar
        mode="single"
        selected={date ? new Date(date) : undefined}
        onSelect={onDateChange}
        className="rounded-md border scale-125 w-fit"
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
                <div className={cn(
                  "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 rounded-full",
                  date.toDateString() === selectedDate?.toDateString() ? 'bg-white' : 'bg-slate-600'
                )} />
              )}
            </div>
          ),
        }}
      />
    </div>
  );
}

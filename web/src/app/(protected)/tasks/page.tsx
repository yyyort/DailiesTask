"use server";

import TaskAddButton from "@/components/tasks/task-add-button";
import TaskFilter from "@/components/tasks/task-filter";

import TaskMobile from "./tasks-mobile";
import { Suspense } from "react";
import TasksLaptop from "./tasks-laptop";
import TasksLaptopSkeleton from "@/components/tasks/tasks-laptop-skeleton";
import TasksMobileSkeleton from "@/components/tasks/tasks-mobile-skeleton";
import HomeCalendar from "@/components/home/homeCalendar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Tasks(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const filterParams = searchParams.filter as string;
  const dateParams = searchParams.date as string;

  return (
    <div
      className="h-screen w-full flex flex-col overflow-y-auto
    phone-sm:px-10 phone-sm:py-10
    "
    >
      {/* 
        task today / tasks header
      */}
      <div className="flex flex-col">
        <div
          className="
          phone-sm:flex phone-sm:flex-col phone-sm:gap-4 phone-sm:items-end
        laptop:flex laptop:flex-row-reverse laptop:justify-between laptop:w-full laptop:pb-4"
        >
          <div
            className="
            phone-sm:hidden
            laptop:block
            "
          >
            <TaskAddButton />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center laptop:gap-2 phone-sm:gap-4">
              <div className="z-10">
                <HomeCalendar variant="minimal"/>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[2rem] text-foreground text-end">
                  {dateParams
                    ? dateParams === new Date().toLocaleDateString()
                      ? "Tasks Today"
                      : "Tasks"
                    : "Tasks Today"}
                </h1>

                {/* date today */}
                <h3
                  className="
                phone-sm:text-sm text-muted-foreground
                laptop:text-lg
                phone-sm:text-end laptop:text-start
              "
                >
                  {dateParams
                    ? new Date(dateParams).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })
                    : new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 
          tasks filter
        */}
        <div className="flex justify-between items-center">
          <TaskFilter />

          {/* task count */}
          <h3 className="text-2xl text-foreground">
            {/* {tasks.filter((task) => task.status === "done").length} /{" "}
            {tasks.length} */}
          </h3>
        </div>

        {/* 
          tasks container
        */}

        {/* mobile */}
        <div
          className="
            phone-sm:flex phone-sm:flex-col phone-sm:gap-4
            laptop:hidden
          "
        >
          <Suspense fallback={<TasksMobileSkeleton />}>
            <TaskMobile filter={filterParams} dateFilter={dateParams} />
          </Suspense>

          <div
            className="
            laptop:hidden
            phone-sm:absolute phone-sm:bottom-14 phone-sm:right-5 phone-sm:mb-5
          "
          >
            <TaskAddButton />
          </div>
        </div>

        {/* laptop */}
        <div
          className="
            phone-sm:hidden
            laptop:grid
          "
        >
          <Suspense fallback={<TasksLaptopSkeleton />}>
            <TasksLaptop filter={filterParams} dateFilter={dateParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

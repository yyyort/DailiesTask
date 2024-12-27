import { taskGetEverythingService } from "@/service/tasks/taskService";
import React from "react";
import HomeCalendarMobile from "./homeCalendar-mobile";
import HomeCalendarLaptop from "./homeCalendar-laptop";

export default async function HomeCalendar({
  variant = "default",
}: {
  variant?: string;
}) {
  const tasks: {
    id: string;
    date: Date;
  }[] = await taskGetEverythingService();

  return (
    <div>
      {variant === "default" && (
        <div>
          <div
            className="
              phone-sm:hidden
              laptop:block
              "
          >
            <HomeCalendarLaptop tasks={tasks} />
          </div>

          <div className="flex justify-between items-center">
            <div
              className="
                phone-sm:block
                laptop:hidden
                "
            >
              <HomeCalendarMobile tasks={tasks} />
            </div>
          </div>
        </div>
      )}
      {variant === "minimal" && (
        <div>
          <HomeCalendarMobile tasks={tasks} variant="minimal" />
        </div>
      )}
    </div>
  );
}

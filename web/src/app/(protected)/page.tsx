import ContributionsHeatmap from "@/components/home/contributions-heatmap";
import HomeCalendar from "@/components/home/homeCalendar";
import { ContributionReturnType } from "@/model/contribution.model";
import { TaskReturnType } from "@/model/task.model";
import { contributionGetService } from "@/service/contributionService";
import { taskGetService } from "@/service/taskService";
import TasksHome from "./tasks/tasks-home";
import HomeCalendarMobile from "@/components/home/homeCalendar-mobile";
import PinnedNotes from "@/components/home/pinnedNotes";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const date = searchParams.date as string;

  console.log(date);

  const contributions: ContributionReturnType[] =
    await contributionGetService();
  const tasks: TaskReturnType[] = await taskGetService(date);
  const totalTasksDone = tasks.filter((task) => task.status === "done").length;
  const totalTasks = tasks.length;

  return (
    <div
      className="w-full h-screen max-w-full pt-20 px-10 gap-10 justify-center items-start max-h-screen overflow-auto
    laptop:flex laptop:flex-row
    "
    >
      {/* contributions graph */}
      <div>
        <ContributionsHeatmap contributions={contributions} />

        {/* notes */}
        <div
          className="
            pl-7
            phone-sm:hidden
            laptop:block
          "
        >
          <h2 className="text-lg font-bold text-slate-900 py-4">
            Pinned Notes:{" "}
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <PinnedNotes />
          </Suspense>
        </div>
      </div>

      <div className="">
        {/* tasks */}
        <div className="flex flex-col gap-4 p-4 overflow-auto">
          <div
            className="
        phone-sm:hidden
        laptop:block
        "
          >
            <HomeCalendar />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {totalTasksDone} / {totalTasks} tasks done
            </h3>
            <div
              className="
          phone-sm:block
          laptop:hidden
          "
            >
              <HomeCalendarMobile />
            </div>
          </div>

          <TasksHome tasks={tasks} />
        </div>

        {/* notes */}
        <div
          className="
            phone-sm:block
            laptop:hidden
          "
        >
          <h2 className="text-lg font-bold text-slate-900 py-4">
            Pinned Notes:{" "}
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <PinnedNotes />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

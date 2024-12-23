import ContributionsHeatmap from "@/components/home/contributions-heatmap";
import HomeCalendar from "@/components/home/homeCalendar";
import { ContributionReturnType } from "@/model/contribution.model";
import { TaskReturnType } from "@/model/task.model";
import { contributionGetService } from "@/service/contributionService";
import { taskGetService } from "@/service/taskService";
import TasksHome from "./tasks/tasks-home";

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
      <div>
        <ContributionsHeatmap contributions={contributions} />
      </div>
      <div className="">
        <div
          className="
        phone-sm:hidden
        laptop:block
        "
        >
          <HomeCalendar />
        </div>

        <div className="flex flex-col gap-4 p-4 overflow-auto">
          <h3 className="text-lg font-medium">
            {totalTasksDone} / {totalTasks} tasks done
          </h3>

          <TasksHome tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

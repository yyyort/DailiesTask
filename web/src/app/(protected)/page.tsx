import ContributionsHeatmap from "@/components/home/contributions-heatmap";
import { contributionGetService } from "@/service/contributionService";

import PinnedNotes from "@/components/home/pinnedNotes";
import { Suspense } from "react";
import PinnedNotesSkeleton from "@/components/home/pinnedNotes-skeleton";
import TasksHome from "@/components/home/tasks-home";
import TasksHomeSkeleton from "@/components/home/tasks-home-skeleton";
import HomeCalendar from "@/components/home/homeCalendar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const date = searchParams.date as string;

  const contributions = await contributionGetService();

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
          <h2 className="text-lg font-bold text-foreground py-4">
            Pinned Notes:{" "}
          </h2>
          <Suspense fallback={<PinnedNotesSkeleton />}>
            <PinnedNotes />
          </Suspense>
        </div>
      </div>

      <div className="">
        {/* tasks */}
        <div
          className="flex gap-4 p-4 overflow-auto
          phone-sm:flex-row
          laptop:flex-col
        
        "
        >
          <Suspense fallback={<div>Loading...</div>}>
            <HomeCalendar />
          </Suspense>

          <Suspense fallback={<TasksHomeSkeleton />}>
            <TasksHome date={date} />
          </Suspense>
        </div>

        {/* notes */}
        <div
          className="
            phone-sm:block
            laptop:hidden
          "
        >
          <h2 className="text-lg font-bold text-foreground py-4">
            Pinned Notes:{" "}
          </h2>
          <Suspense fallback={<PinnedNotesSkeleton />}>
            <PinnedNotes />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

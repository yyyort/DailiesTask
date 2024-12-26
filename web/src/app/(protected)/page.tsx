import ContributionsHeatmap from "@/components/home/contributions-heatmap";
import HomeCalendar from "@/components/home/homeCalendar";
import { ContributionReturnType } from "@/model/contribution.model";

import { contributionGetService } from "@/service/contributionService";

import HomeCalendarMobile from "@/components/home/homeCalendar-mobile";
import PinnedNotes from "@/components/home/pinnedNotes";
import { Suspense } from "react";
import PinnedNotesSkeleton from "@/components/home/pinnedNotes-skeleton";
import TasksHome from "@/components/home/tasks-home";
import TasksHomeSkeleton from "@/components/home/tasks-home-skeleton";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const date = searchParams.date as string;

  const contributions: ContributionReturnType[] =
    await contributionGetService();

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
            <h3 className="text-lg font-medium"></h3>
            <div
              className="
          phone-sm:block
          laptop:hidden
          "
            >
              <HomeCalendarMobile />
            </div>
          </div>

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

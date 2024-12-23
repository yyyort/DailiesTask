import LogoutButton from "../auth-page/logout-button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import SidebarLinks from "./sidebar-links";
import { AlignLeftIcon } from "lucide-react";

export default function SidebarMobile() {
  return (
    <div
      className="fixed top-10 mx-2 w-full
      "
    >
      <Sheet>
        <SheetTrigger asChild>
          <button>
            <AlignLeftIcon className="size-10 stroke-1" />
          </button>
        </SheetTrigger>

        <SheetContent
          side={"left"}
          className="w-1/2 h-screen flex flex-col justify-between"
        >
          <SheetHeader className="flex flex-col gap-5 justify-start items-start">
            <SheetTitle>DailiesTask</SheetTitle>
            <div className="flex flex-col gap-5 w-full">
              <SidebarLinks expanded={true} variant="mobile" />
            </div>
          </SheetHeader>

          <SheetFooter>
            <LogoutButton />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

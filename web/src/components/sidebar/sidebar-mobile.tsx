import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import SidebarLinks from "./sidebar-links";

export default function SidebarMobile() {
  return (
    <div
      className="fixed top-10 mx-2
      "
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} className="size-10">
            <HamburgerMenuIcon
              className="size-20
        phone-sm:block
          desktop:hidden
        "
            />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="w-1/2 h-screen flex flex-col justify-between"
        >
          <SheetHeader className="flex flex-col gap-5 justify-start items-start">
            <SheetTitle>DailiesTask</SheetTitle>
            <div className="flex flex-col gap-5">
              <SidebarLinks expanded={false}/>
            </div>
          </SheetHeader>

          <SheetFooter>
            <Button variant={"outline"}>Logout</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

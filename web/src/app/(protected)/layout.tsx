import SidebarLaptop from "@/components/sidebar/sidebar-laptop";
import SidebarMobile from "@/components/sidebar/sidebar-mobile";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row gap-2 w-full max-w-full overflow-clip">
      <div
        className="
          phone-sm:block
          laptop:hidden
        "
      >
        <SidebarMobile />
      </div>

      <div
        className="
          phone-sm:hidden
          laptop:block
        "
      >
        <SidebarLaptop />
      </div>

      <div className="flex flex-col w-full">
        <div>{children}</div>
      </div>
    </div>
  );
}

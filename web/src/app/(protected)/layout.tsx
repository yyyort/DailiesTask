import Sidebar from "@/components/sidebar/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row gap-2">
      <Sidebar />
      <div className="flex flex-col">
        <div>{children}</div>
      </div>
    </div>
  );
}

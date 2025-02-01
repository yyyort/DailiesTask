import Navbar from "@/components/navbar/navbar";
import React from "react";
import About from "./about";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full max-w-full overflow-x-clip
      phone-sm:my-56
      laptop:my-4
      flex flex-col gap-10
    ">
      <Navbar />
      {children}

      {/* about section */}
      <section id="about" className="w-full h-full min-w-full">
        <About />
      </section>
    </div>
  );
}

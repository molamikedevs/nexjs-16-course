import React from "react";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/right-sidebar";
import LeftSidebar from "@/components/navigation/left-sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />

      <div className="flex">
        <LeftSidebar />

        <section className="min-h-screen flex-1 px-6 pt-36 pb-6 sm:px-14 md:pb-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
    </main>
  );
}

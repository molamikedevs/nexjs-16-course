import Navbar from "@/components/navigation/navbar";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}

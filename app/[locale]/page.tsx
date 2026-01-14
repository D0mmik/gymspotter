"use client";

import { GymMap } from "@/components/map/GymMap";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [multisportFilter, setMultisportFilter] = useState<boolean>(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Header />
      <GymMap multisportFilter={multisportFilter} />
      <Footer
        toggleMultisportFilter={() => setMultisportFilter(!multisportFilter)}
        multisportFilter={multisportFilter}
      />
    </main>
  );
}

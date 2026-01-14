"use client";

import { GymMap } from "@/components/map/GymMap";
import { useState } from "react";
import { Footer } from "@/components/Footer";

export function HomeClient() {
  const [multisportFilter, setMultisportFilter] = useState<boolean>(false);

  return (
    <>
      <GymMap multisportFilter={multisportFilter} />
      <Footer
        toggleMultisportFilter={() => setMultisportFilter(!multisportFilter)}
        multisportFilter={multisportFilter}
      />
    </>
  );
}

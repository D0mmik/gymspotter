"use client";

import { GymMap, type GymMapRef } from "@/components/GymMap";
import { MapPin, Dumbbell, Navigation } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const mapRef = useRef<GymMapRef>(null);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 bg-white/8 backdrop-blur-[60px] backdrop-saturate-200 border-b border-white/10">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30">
              <Dumbbell className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                <span className="bg-linear-to-r from-white to-zinc-200 bg-clip-text text-transparent">
                  Your Gym Spotter
                </span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <p className="text-xs font-medium text-zinc-400">Prague</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-full w-full pt-18 relative">
        <GymMap ref={mapRef} />
        <button
          onClick={() => mapRef.current?.centerOnLocation()}
          className="absolute bottom-6 right-6 z-20 flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors shadow-lg backdrop-blur-sm"
          aria-label="Show my location"
        >
          <Navigation className="w-6 h-6 text-red-500" />
        </button>
      </div>
    </main>
  );
}

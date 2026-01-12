"use client";

import { GymMap, type GymMapRef } from "@/components/GymMap";
import { AddGymDrawer } from "@/components/AddGymDrawer";
import { MapPin, Dumbbell, Navigation, Plus, Globe } from "lucide-react";
import { useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function Home() {
  const mapRef = useRef<GymMapRef>(null);
  const [addGymOpen, setAddGymOpen] = useState(false);
  const { locale, setLocale, t, isReady } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === "cs" ? "en" : "cs");
  };

  // Don't render UI text until locale is determined to prevent flash
  if (!isReady) {
    return (
      <main className="relative h-[100dvh] w-full overflow-hidden bg-zinc-950">
        <div className="h-full w-full">
          <GymMap ref={mapRef} />
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      <header 
        className="absolute top-0 left-0 right-0 z-10
          bg-zinc-950/40 backdrop-blur-md
          pb-8 px-4
          mask-[linear-gradient(to_bottom,black_40%,transparent)]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
      >
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 min-h-0 min-w-0 rounded-lg bg-red-500/20 border border-red-500/30">
                <Dumbbell className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  <span className="bg-linear-to-r from-white to-zinc-200 bg-clip-text text-transparent">
                    {t("appName")}
                  </span>
                </h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-xs font-medium text-zinc-400">{t("location")}</p>
                </div>
              </div>
            </div>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 active:bg-zinc-600/50 transition-colors text-xs font-medium text-zinc-300"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              {t("switchLanguage")}
            </button>
          </div>
        </div>
      </header>
      <div className="h-full w-full relative">
        <GymMap ref={mapRef} />
        <div 
          className="absolute right-4 z-20 flex flex-row gap-3"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
        >
          <button
            onClick={() => setAddGymOpen(true)}
            className="flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 active:bg-red-500/40 transition-colors shadow-lg backdrop-blur-sm"
            aria-label={t("addGym")}
          >
            <Plus className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-500">{t("addGym")}</span>
          </button>
          <button
            onClick={() => mapRef.current?.centerOnLocation()}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 active:bg-red-500/40 transition-colors shadow-lg backdrop-blur-sm"
            aria-label={t("showMyLocation")}
          >
            <Navigation className="w-6 h-6 text-red-500" />
          </button>
        </div>
      </div>

      <AddGymDrawer open={addGymOpen} onOpenChange={setAddGymOpen} />
    </main>
  );
}

import Link from "next/link";
import {
  ArrowLeftIcon,
  GithubIcon,
  X,
  MapPin,
  Filter,
  Dumbbell,
  Clock,
  Camera,
} from "lucide-react";
import { ToggleLocaleButton } from "@/components/ToggleLocaleButton";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <main className="h-screen w-full bg-zinc-950 overflow-hidden md:min-h-screen md:overflow-auto">
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
              <Link
                href="/"
                prefetch={true}
                className="flex items-center justify-center w-10 h-10 min-h-0 min-w-0 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-red-500" />
              </Link>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                {t("aboutTitle")}
              </h1>
            </div>
            <ToggleLocaleButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-28 pb-20 max-w-87.5 sm:max-w-100 md:max-w-125">
        <div className="mb-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            {t("aboutDescription")}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-red-500" />
            {t("aboutFeatures")}
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-zinc-300 text-sm">{t("aboutFeature1")}</p>
            </div>
            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg">
              <Filter className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-zinc-300 text-sm">{t("aboutFeature2")}</p>
            </div>
            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg">
              <Dumbbell className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-zinc-300 text-sm">{t("aboutFeature3")}</p>
            </div>
            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-zinc-300 text-sm">{t("aboutFeature4")}</p>
            </div>
            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg">
              <Camera className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-zinc-300 text-sm">{t("aboutFeature5")}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <h3 className="text-xl font-bold text-white mb-2">
            {t("aboutContribute")}
          </h3>
          <p className="text-zinc-300 text-sm">{t("aboutContributeText")}</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-3">
            <Link
              href="https://github.com/D0mmik/gymspotter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                <GithubIcon className="w-5 h-5 text-zinc-300 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">GitHub</p>
                <p className="text-zinc-400 text-sm">
                  github.com/D0mmik/gymspotter
                </p>
              </div>
            </Link>
            <Link
              href="https://x.com/DStrnadel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                <X className="w-5 h-5 text-zinc-300 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">X (Twitter)</p>
                <p className="text-zinc-400 text-sm">@Dstrnadel</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

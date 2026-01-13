"use client";

import {Button} from "@/components/ui/button";
import {Dumbbell, Globe, MapPin} from "lucide-react";
import {useTranslations, useLocale} from "next-intl";
import {usePathname, useRouter} from "next/navigation";

export function Header() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const newLocale = locale === "cs" ? "en" : "cs";
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
    };

    return (
        <header
            className="absolute top-0 left-0 right-0 z-10
          bg-zinc-950/40 backdrop-blur-md
          pb-8 px-4
          mask-[linear-gradient(to_bottom,black_40%,transparent)]"
            style={{paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)"}}
        >
            <div className="container mx-auto px-4 py-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-10 h-10 min-h-0 min-w-0 rounded-lg bg-red-500/20 border border-red-500/30">
                            <Dumbbell className="w-5 h-5 text-red-500"/>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  <span className="bg-linear-to-r from-white to-zinc-200 bg-clip-text text-transparent">
                    {t('appName')}
                  </span>
                            </h1>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <MapPin className="w-3.5 h-3.5 text-zinc-400"/>
                                <p className="text-xs font-medium text-zinc-400">{t('location')}</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={toggleLocale}
                        className="flex items-center gap-1.5 px-3 py-1.5 min-h-11 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 active:bg-zinc-600/50 transition-colors text-xs font-medium text-zinc-300"
                        aria-label="Switch language"
                    >
                        <Globe className="w-3.5 h-3.5"/>
                        {t('switchLanguage')}
                    </Button>
                </div>
            </div>
        </header>
    )
}
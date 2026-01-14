"use client";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function ToggleLocaleButton() {
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
    <Button
      variant="ghost"
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 min-h-11 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 active:bg-zinc-600/50 transition-colors text-xs font-medium text-zinc-300"
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5" />
      {t("switchLanguage")}
    </Button>
  );
}

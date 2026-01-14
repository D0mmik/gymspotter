"use client";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

interface ToggleButtonProps {
  value: boolean | undefined;
  onChange: (v: boolean | undefined) => void;
  label: string;
}

export function ToggleButton({ value, onChange, label }: ToggleButtonProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="text-zinc-300 text-sm leading-none">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange(value === true ? undefined : true)}
          className={`px-3 py-1 h-8 text-xs rounded-lg transition-colors ${
            value === true
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          {t("yes")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange(value === false ? undefined : false)}
          className={`px-3 py-1 h-8 text-xs rounded-lg transition-colors ${
            value === false
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          {t("no")}
        </Button>
      </div>
    </div>
  );
}

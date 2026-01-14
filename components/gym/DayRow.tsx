import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DayRowProps {
  day: string;
  dayHours: { open: string; close: string };
  isToday: boolean;
}

export function DayRow({ day, dayHours, isToday }: DayRowProps) {
  const t = useTranslations();

  const dayClassName = cn(
    "flex items-center py-1.5 px-3 rounded-lg",
    isToday && "bg-red-500/10 border border-red-500/30",
  );

  const dayLabelClassName = cn(
    "text-sm w-1/3",
    isToday ? "text-red-500 font-medium" : "text-zinc-400",
  );

  const timeClassName = cn(
    "text-sm w-1/3 text-center",
    isToday ? "text-white font-medium" : "text-zinc-300",
  );

  return (
    <div className={dayClassName}>
      <span className={dayLabelClassName}>{t(day)}</span>
      <span className={timeClassName}>
        {`${dayHours.open} - ${dayHours.close}`}
      </span>
      <span className="text-xs w-1/3 text-right text-red-500">
        {isToday && t("today")}
      </span>
    </div>
  );
}

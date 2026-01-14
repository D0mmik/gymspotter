import { OpeningHours } from "@/lib/types/gyms";
import { DAYS_ORDER, getCurrentDay, cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DayRow } from "@/components/gym/DayRow";

interface OpeningHoursProps {
  openingHours?: OpeningHours | undefined;
}

export function OpeningHoursInfo({ openingHours }: OpeningHoursProps) {
  const t = useTranslations();

  if (!openingHours) {
    return null;
  }

  const currentDay = getCurrentDay();

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
        {t("openingHours")}
      </h3>
      <div className="space-y-1">
        {DAYS_ORDER.map((day) => (
          <DayRow
            key={day}
            day={day}
            dayHours={openingHours[day]}
            isToday={currentDay === day}
          />
        ))}
      </div>
    </div>
  );
}

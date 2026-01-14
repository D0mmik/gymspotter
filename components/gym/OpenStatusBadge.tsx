import { isGymOpen } from "@/lib/utils";
import { OpeningHours } from "@/lib/types/gyms";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface OpenStatusBadgeProps {
  openingHours?: OpeningHours;
}

export function OpenStatusBadge({ openingHours }: OpenStatusBadgeProps) {
  const t = useTranslations();
  const opened247 = openingHours === undefined;

  if (!opened247) {
    const gymOpen = isGymOpen(openingHours);

    if (gymOpen) {
      return (
        <Badge className="text-sm md:text-base font-medium whitespace-nowrap bg-transparent text-green-400">
          {t("open")}
        </Badge>
      );
    }

    return (
      <Badge className="text-sm md:text-base font-medium whitespace-nowrap bg-transparent text-red-400">
        {t("closed")}
      </Badge>
    );
  }

  return (
    <Badge className="bg-transparent text-sm md:text-base font-medium whitespace-nowrap text-green-400">
      {t("open24_7")}
    </Badge>
  );
}

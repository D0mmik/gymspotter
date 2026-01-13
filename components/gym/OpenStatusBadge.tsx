"use client";

import {isGymOpen} from "@/lib/utils";
import {OpeningHours} from "@/lib/types/gyms";
import {Badge} from "@/components/ui/badge";
import {useTranslations} from "next-intl";

interface OpenStatusBadgeProps {
    openingHours?: OpeningHours
}

export function OpenStatusBadge({openingHours}: OpenStatusBadgeProps) {
    const t = useTranslations();
    const opened247 = openingHours === undefined;
    if (!opened247) {

        const gymOpen = isGymOpen(openingHours);

        return <Badge className={`text-sm md:text-base font-medium whitespace-nowrap bg-transparent ${
                          gymOpen ? "text-green-400" : "text-red-400"
                      }`}
        >
            {gymOpen ? t('open') : t('closed')}
        </Badge>
    }

    return <Badge className="bg-transparent text-sm md:text-base font-medium whitespace-nowrap text-green-400">
        {t('open24_7')}
    </Badge>


}
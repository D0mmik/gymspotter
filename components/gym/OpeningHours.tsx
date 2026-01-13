"use client";

import {OpeningHours} from "@/lib/types/gyms";
import {DAYS_ORDER, getCurrentDay} from "@/lib/utils";
import {useTranslations} from "next-intl";

interface OpeningHoursProps {
    openingHours?: OpeningHours | undefined;
}

export function OpeningHoursInfo({openingHours}: OpeningHoursProps) {
    const t = useTranslations();

    return (
        openingHours && (
            <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                    {t('openingHours')}
                </h3>
                <div className="space-y-1">
                    {DAYS_ORDER.map((day) => {
                        const dayHours = openingHours![day];
                        const isToday = getCurrentDay() === day;
                        return (
                            <div
                                key={day}
                                className={`flex items-center py-1.5 px-3 rounded-lg ${
                                    isToday ? "bg-red-500/10 border border-red-500/30" : ""
                                }`}
                            >
                            <span className={`text-sm w-1/3 ${isToday ? "text-red-500 font-medium" : "text-zinc-400"}`}>
                              {t(day)}
                            </span>
                                <span
                                    className={`text-sm w-1/3 text-center ${isToday ? "text-white font-medium" : "text-zinc-300"}`}>
                              {dayHours.closed ? t('closed') : `${dayHours.open} - ${dayHours.close}`}
                            </span>
                                <span className="text-xs w-1/3 text-right text-red-500">
                              {isToday && t('today')}
                            </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    )
}
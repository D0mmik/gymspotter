"use client";

import {Badge} from "@/components/ui/badge";
import {VerifiedIcon} from "lucide-react";
import {useTranslations} from "next-intl";

interface MultisportBadgeProps {
    multisport: boolean;
}

export function MultisportBadge({multisport}: MultisportBadgeProps) {
    const t = useTranslations();

    return <Badge className={multisport ? "bg-green-500/20 text-green-400" : "bg-zinc-700/50 text-zinc-500"}>
        <VerifiedIcon/>
        {multisport ? t('multisportYes') : t('multisportNo')}
    </Badge>
}
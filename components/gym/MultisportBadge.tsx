import { Badge } from "@/components/ui/badge";
import { VerifiedIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface MultisportBadgeProps {
  multisport: boolean;
}

export function MultisportBadge({ multisport }: MultisportBadgeProps) {
  const t = useTranslations();

  if (multisport) {
    return (
      <Badge className="bg-green-500/20 text-green-400">
        <VerifiedIcon />
        {t("multisportYes")}
      </Badge>
    );
  }

  return (
    <Badge className="bg-zinc-700/50 text-zinc-500">
      <VerifiedIcon />
      {t("multisportNo")}
    </Badge>
  );
}

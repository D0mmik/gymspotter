import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { AddGymDrawer } from "@/components/forms/AddGymDrawer";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface FooterProps {
  toggleMultisportFilter: () => void;
  multisportFilter: boolean;
}

export function Footer({
  toggleMultisportFilter,
  multisportFilter,
}: FooterProps) {
  const [addGymOpen, setAddGymOpen] = useState(false);
  const t = useTranslations();

  return (
    <>
      <div
        className="fixed right-4 z-20 flex flex-row gap-3"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
      >
        {multisportFilter && (
          <Button
            onClick={toggleMultisportFilter}
            className={
              "flex items-center gap-2 px-4 py-3 min-h-12 rounded-xl border transition-colors shadow-lg backdrop-blur-sm bg-green-500/20 border-green-500/30 hover:bg-green-500/30 active:bg-green-500/40 select-none"
            }
            aria-label={t("filter")}
          >
            <Filter className={"w-5 h-5 text-green-500"} />
            <span className="text-sm font-medium text-green-500 select-none">
              {t("filterMultisport")}
            </span>
          </Button>
        )}

        {!multisportFilter && (
          <Button
            onClick={toggleMultisportFilter}
            className="flex items-center gap-2 px-4 py-3 min-h-12 rounded-xl border transition-colors shadow-lg backdrop-blur-sm bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 active:bg-zinc-600/50"
            aria-label={t("filter")}
          >
            <Filter className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">
              {t("filterAll")}
            </span>
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setAddGymOpen(true)}
          className="flex items-center gap-2 px-4 py-3 min-h-12 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 active:bg-red-500/40 transition-colors shadow-lg backdrop-blur-sm select-none"
          aria-label={t("addGym")}
        >
          <Plus className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500">
            {t("addGym")}
          </span>
        </Button>
      </div>
      <AddGymDrawer open={addGymOpen} onOpenChange={setAddGymOpen} />
    </>
  );
}

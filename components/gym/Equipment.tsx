import { Button } from "@/components/ui/button";
import { Gym } from "@/lib/types/gyms";
import { useTranslations } from "next-intl";

interface EquipmentProps {
  selectedGym: Gym;
  onOpenChange: (open: boolean) => void;
}

export function EquipmentInfo({ selectedGym, onOpenChange }: EquipmentProps) {
  const t = useTranslations();

  const handleEquipmentDrawerOpen = () => {
    onOpenChange(true);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
        {t("equipment")}
      </h3>
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.rackCount !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("rackCount")}
          </span>
          <span
            className={
              selectedGym.rackCount !== undefined
                ? "text-zinc-300"
                : "text-zinc-600"
            }
          >
            {selectedGym.rackCount !== undefined
              ? `${selectedGym.rackCount} ks`
              : "?"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.dumbbellMaxKg !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("dumbbellMaxKg")}
          </span>
          <span
            className={
              selectedGym.dumbbellMaxKg !== undefined
                ? "text-zinc-300"
                : "text-zinc-600"
            }
          >
            {selectedGym.dumbbellMaxKg !== undefined
              ? `${selectedGym.dumbbellMaxKg} kg`
              : "?"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.hasDeadliftPlatform !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("hasDeadliftPlatform")}
          </span>
          <span
            className={
              selectedGym.hasDeadliftPlatform === undefined
                ? "text-zinc-600"
                : selectedGym.hasDeadliftPlatform
                  ? "text-green-400"
                  : "text-zinc-500"
            }
          >
            {selectedGym.hasDeadliftPlatform === undefined
              ? "?"
              : selectedGym.hasDeadliftPlatform
                ? "✓"
                : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.hasMagnesium !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("hasMagnesium")}
          </span>
          <span
            className={
              selectedGym.hasMagnesium === undefined
                ? "text-zinc-600"
                : selectedGym.hasMagnesium
                  ? "text-green-400"
                  : "text-zinc-500"
            }
          >
            {selectedGym.hasMagnesium === undefined
              ? "?"
              : selectedGym.hasMagnesium
                ? "✓"
                : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.hasAirCon !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("hasAirCon")}
          </span>
          <span
            className={
              selectedGym.hasAirCon === undefined
                ? "text-zinc-600"
                : selectedGym.hasAirCon
                  ? "text-green-400"
                  : "text-zinc-500"
            }
          >
            {selectedGym.hasAirCon === undefined
              ? "?"
              : selectedGym.hasAirCon
                ? "✓"
                : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 px-3">
          <span
            className={
              selectedGym.hasParking !== undefined
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          >
            {t("hasParking")}
          </span>
          <span
            className={
              selectedGym.hasParking === undefined
                ? "text-zinc-600"
                : selectedGym.hasParking
                  ? "text-green-400"
                  : "text-zinc-500"
            }
          >
            {selectedGym.hasParking === undefined
              ? "?"
              : selectedGym.hasParking
                ? "✓"
                : "✗"}
          </span>
        </div>
      </div>
      <Button
        variant="link"
        onClick={handleEquipmentDrawerOpen}
        className="text-red-500 active:text-red-400 text-sm font-medium transition-colors px-0 hover:bg-transparent"
      >
        {t("addEquipmentInfo")}
      </Button>
    </div>
  );
}

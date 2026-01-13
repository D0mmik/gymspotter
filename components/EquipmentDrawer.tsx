"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Dumbbell, Send, CheckCircle, X, AlertCircle, HelpCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ToggleButton} from "@/components/ToggleButton";
import {Gym} from "@/lib/types/gyms";
import {useTranslations} from "next-intl";

interface EquipmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGym: Gym;
}

export function EquipmentDrawer({ open, onOpenChange, selectedGym }: EquipmentDrawerProps) {
  const t = useTranslations();
  const [rackCount, setRackCount] = useState<string>("");
  const [dumbbellMaxKg, setDumbbellMaxKg] = useState<string>("");
  const [hasDeadliftPlatform, setHasDeadliftPlatform] = useState<boolean | null>(null);
  const [hasMagnesium, setHasMagnesium] = useState<boolean | null>(null);
  const [hasAirCon, setHasAirCon] = useState<boolean | null>(null);
  const [hasParking, setHasParking] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createEquipmentRequest = useMutation(api.requests.createEquipmentRequest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one field is filled
    const hasAnyValue = 
      rackCount !== "" || 
      dumbbellMaxKg !== "" || 
      hasDeadliftPlatform !== null || 
      hasMagnesium !== null || 
      hasAirCon !== null ||
      hasParking !== null ||
      note.trim() !== "";

    if (!hasAnyValue) {
      setErrorMessage(t('errorRequired'));
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await createEquipmentRequest({
        gymId: selectedGym._id,
        gymName: selectedGym.name,
        rackCount: rackCount ? parseInt(rackCount) : undefined,
        dumbbellMaxKg: dumbbellMaxKg ? parseInt(dumbbellMaxKg) : undefined,
        hasDeadliftPlatform: hasDeadliftPlatform ?? undefined,
        hasMagnesium: hasMagnesium ?? undefined,
        hasAirCon: hasAirCon ?? undefined,
        hasParking: hasParking ?? undefined,
        note: note.trim() || undefined,
      });
      setStatus("success");
    } catch (error) {
      console.error("Error submitting equipment info:", error);
      setErrorMessage(t('errorGeneric'));
      setStatus("error");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setRackCount("");
      setDumbbellMaxKg("");
      setHasDeadliftPlatform(null);
      setHasMagnesium(null);
      setHasAirCon(null);
      setHasParking(null);
      setNote("");
      setStatus("idle");
      setErrorMessage("");
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] md:max-h-[80vh] flex flex-col">
        <div className="mx-auto w-full max-w-lg flex flex-col flex-1 min-h-0">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-500/20 border border-red-500/30">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <DrawerTitle className="text-xl md:text-2xl font-bold text-white">
                  {t('equipment')}
                </DrawerTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-6 overflow-y-auto flex-1">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t('thankYou')}</h3>
                <p className="text-zinc-400 mb-6">{t('equipmentSuccess')}</p>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-medium"
                >
                  {t('close')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm md:text-base text-zinc-400 mb-4">
                  {t('equipmentDescription')}
                </p>

                {status === "error" && errorMessage && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Numeric inputs */}
                <div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      {rackCount === "" ? (
                        <HelpCircle className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-zinc-300 text-sm leading-none">{t('rackCount')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={rackCount}
                        onChange={(e) => setRackCount(e.target.value)}
                        placeholder="?"
                        className="w-16 px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                      />
                      <span className="text-zinc-500 text-sm leading-none w-5">ks</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      {dumbbellMaxKg === "" ? (
                        <HelpCircle className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-zinc-300 text-sm leading-none">{t('dumbbellMaxKg')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={dumbbellMaxKg}
                        onChange={(e) => setDumbbellMaxKg(e.target.value)}
                        placeholder="?"
                        className="w-16 px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                      />
                      <span className="text-zinc-500 text-sm leading-none w-5">kg</span>
                    </div>
                  </div>

                  <ToggleButton
                    value={hasDeadliftPlatform}
                    onChange={setHasDeadliftPlatform}
                    label={t('hasDeadliftPlatform')}
                  />
                  <ToggleButton
                    value={hasMagnesium}
                    onChange={setHasMagnesium}
                    label={t('hasMagnesium')}
                  />
                  <ToggleButton
                    value={hasAirCon}
                    onChange={setHasAirCon}
                    label={t('hasAirCon')}
                  />
                  <ToggleButton
                    value={hasParking}
                    onChange={setHasParking}
                    label={t('hasParking')}
                  />

                  <div className="pt-3">
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t('equipmentNotePlaceholder')}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors resize-none text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 h-auto rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm md:text-base mt-4"
                >
                  {status === "sending" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('send')}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

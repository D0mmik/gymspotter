"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useLocale } from "@/components/LocaleProvider";
import { AlertTriangle, Send, CheckCircle, X, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { posthog } from "@/components/PostHogProvider";

interface ReportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: Id<"gyms">;
  gymName: string;
}

export function ReportDrawer({ open, onOpenChange, gymId, gymName }: ReportDrawerProps) {
  const { t } = useLocale();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createErrorReport = useMutation(api.requests.createErrorReport);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setErrorMessage(t("errorRequired"));
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await createErrorReport({
        gymId,
        gymName,
        message: message.trim(),
      });
      setStatus("success");

      posthog.capture("error_report_submitted", {
        gym_id: gymId,
        gym_name: gymName,
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      setErrorMessage(t("errorGeneric"));
      setStatus("error");

      posthog.capture("error_report_failed", {
        gym_id: gymId,
        gym_name: gymName,
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
      posthog.captureException(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setMessage("");
      setStatus("idle");
      setErrorMessage("");
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] md:max-h-[80vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                </div>
                <DrawerTitle className="text-xl md:text-2xl font-bold text-white">
                  {t("reportTitle")}
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

          <div className="px-4 pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t("thankYou")}</h3>
                <p className="text-zinc-400 mb-6">{t("reportSuccess")}</p>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-medium"
                >
                  {t("close")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm md:text-base text-zinc-400 mb-4">
                  {t("reportDescription")}
                </p>

                {status === "error" && errorMessage && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("reportPlaceholder")}
                  rows={4}
                  className="w-full px-4 py-3 md:py-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none text-base"
                />

                <Button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 h-auto rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-base md:text-lg"
                >
                  {status === "sending" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t("send")}
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

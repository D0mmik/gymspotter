import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { Gym } from "@/lib/types/gyms";
import { useTranslations } from "next-intl";

interface ReportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGym: Gym;
}

export function ReportDrawer({
  open,
  onOpenChange,
  selectedGym,
}: ReportDrawerProps) {
  const t = useTranslations();
  const createErrorReport = useMutation(api.reports.createErrorReport);

  const reportSchema = z.object({
    message: z.string().min(2),
  });

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    try {
      await createErrorReport({
        gymId: selectedGym._id,
        name: selectedGym.name,
        message: values.message,
      });
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  }

  const handleClose = () => {
    onOpenChange(false);
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
            {form.formState.isSubmitSuccessful ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {t("thankYou")}
                </h3>
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <p className="text-sm md:text-base text-zinc-400 mb-4">
                    {t("reportDescription")}
                  </p>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t("reportPlaceholder")}
                            rows={4}
                            className="w-full px-4 py-3 md:py-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 h-auto rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-base md:text-lg"
                  >
                    {form.formState.isSubmitting ? t("sending") : t("send")}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

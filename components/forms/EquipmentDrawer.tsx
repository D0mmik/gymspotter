import { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Dumbbell, Send, CheckCircle, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleButton } from "@/components/ToggleButton";
import { Gym } from "@/lib/types/gyms";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";

interface EquipmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGym: Gym;
}

export function EquipmentDrawer({
  open,
  onOpenChange,
  selectedGym,
}: EquipmentDrawerProps) {
  const t = useTranslations();

  const createEquipmentRequest = useMutation(
    api.equipment.createEquipmentRequest,
  );

  const equipmentSchema = z.object({
    rackCount: z
      .number()
      .min(0, {
        message: "RackCount must be at least 0",
      })
      .max(100, { message: "RackCount must be less than 100" })
      .optional(),
    dumbbellMaxKg: z
      .number()
      .min(1, {
        message: "Dumbbells must be at least 1kg",
      })
      .max(1000, { message: "Dumbbells must be less than 1000kg" })
      .optional(),
    hasDeadliftPlatform: z.boolean().optional(),
    hasMagnesium: z.boolean().optional(),
    hasAirCon: z.boolean().optional(),
    hasParking: z.boolean().optional(),
    note: z.string().optional(),
  });

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      rackCount: undefined,
      dumbbellMaxKg: undefined,
      hasDeadliftPlatform: undefined,
      hasMagnesium: undefined,
      hasAirCon: undefined,
      hasParking: undefined,
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof equipmentSchema>) {
    try {
      await createEquipmentRequest({
        gymId: selectedGym._id,
        gymName: selectedGym.name,
        ...values,
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting equipment info:", error);
    }
  }

  const handleClose = () => {
    onOpenChange(false);
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
                  {t("equipment")}
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
            {form.formState.isSubmitSuccessful ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {t("thankYou")}
                </h3>
                <p className="text-zinc-400 mb-6">{t("equipmentSuccess")}</p>
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
                    {t("equipmentDescription")}
                  </p>

                  <div>
                    <FormField
                      control={form.control}
                      name="rackCount"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-300 text-sm leading-none">
                                  {t("rackCount")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="?"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                      )
                                    }
                                    className="w-16 px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                                  />
                                </FormControl>
                                <span className="text-zinc-500 text-sm leading-none w-5">
                                  ks
                                </span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="dumbbellMaxKg"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-300 text-sm leading-none">
                                  {t("dumbbellMaxKg")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="?"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                      )
                                    }
                                    className="w-16 px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                                  />
                                </FormControl>
                                <span className="text-zinc-500 text-sm leading-none w-5">
                                  kg
                                </span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="hasDeadliftPlatform"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ToggleButton
                              value={field.value}
                              onChange={field.onChange}
                              label={t("hasDeadliftPlatform")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasMagnesium"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ToggleButton
                              value={field.value}
                              onChange={field.onChange}
                              label={t("hasMagnesium")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasAirCon"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ToggleButton
                              value={field.value}
                              onChange={field.onChange}
                              label={t("hasAirCon")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasParking"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ToggleButton
                              value={field.value}
                              onChange={field.onChange}
                              label={t("hasParking")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <div className="pt-3">
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={t("equipmentNotePlaceholder")}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors resize-none text-sm"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 h-auto rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm md:text-base mt-4"
                  >
                    {form.formState.isSubmitting ? (
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
              </Form>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

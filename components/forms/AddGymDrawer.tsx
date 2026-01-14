import { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { MapPin, Send, CheckCircle, X } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddGymDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGymDrawer({ open, onOpenChange }: AddGymDrawerProps) {
  const t = useTranslations();

  const createGymRequest = useMutation(api.gyms.createGymRequest);

  const addGymSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    address: z.string().optional(),
    note: z.string().optional(),
  });

  const form = useForm<z.infer<typeof addGymSchema>>({
    resolver: zodResolver(addGymSchema),
    defaultValues: {
      name: "",
      address: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof addGymSchema>) {
    try {
      await createGymRequest({
        name: values.name,
        address: values.address,
        note: values.note,
      });
    } catch (error) {
      console.error("Error creating gym request:", error);
    }
  }

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] md:max-h-[80vh] flex flex-col">
        <div className="mx-auto max-w-lg flex flex-col h-full overflow-hidden w-full p-2">
          <DrawerHeader className="text-center relative shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute right-0 top-0 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-red-500/20 border border-red-500/30">
                <MapPin className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
              </div>
              <div>
                <DrawerTitle className="text-xl md:text-2xl font-bold text-white">
                  {t("addGymTitle")}
                </DrawerTitle>
                <DrawerDescription className="text-zinc-400 text-sm md:text-base mt-1">
                  {t("addGymDescription")}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          {form.formState.isSubmitSuccessful ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 pb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {t("thankYou")}
              </h3>
              <p className="text-zinc-400 mb-6">{t("thankYouMessage")}</p>
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
                className="flex flex-col flex-1 overflow-hidden"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm md:text-base font-medium text-zinc-300 mb-2">
                        {t("gymName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("gymNamePlaceholder")}
                          className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm md:text-base font-medium text-zinc-300 mb-2">
                        {t("gymAddress")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("gymAddressPlaceholder")}
                          className="w-full px-4 py-3 md:py-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors text-base"
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
                      <FormLabel className="block text-sm md:text-base font-medium text-zinc-300 mb-2">
                        {t("gymNote")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("gymNotePlaceholder")}
                          rows={3}
                          className="w-full px-4 py-3 md:py-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-red-500/50 transition-colors resize-none text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="shrink-0 py-4">
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 h-auto rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-base md:text-lg"
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
                </div>
              </form>
            </Form>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

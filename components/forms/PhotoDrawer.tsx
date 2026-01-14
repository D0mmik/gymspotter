import { useRef, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Camera, Send, CheckCircle, X, ImagePlus, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Gym } from "@/lib/types/gyms";
import { useTranslations } from "next-intl";

interface PhotoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGym: Gym;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoDrawer({
  open,
  onOpenChange,
  selectedGym,
}: PhotoDrawerProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const createPhotoRequest = useMutation(api.photos.createPhotoRequest);

  const photoSchema = z.object({
    image: z
      .instanceof(File, { message: "Please select an image file." })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      })
      .refine((file) => ALLOWED_TYPES.includes(file.type), {
        message: "Only .jpg, .png, and .webp are supported.",
      }),
  });

  const form = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const watchedImage = form.watch("image");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (watchedImage instanceof File) {
      const url = URL.createObjectURL(watchedImage);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setPreviewUrl(null);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [watchedImage]);

  useEffect(() => {
    if (open) {
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  }, [open, form]);

  const handleRemovePhoto = () => {
    form.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  async function onSubmit(values: z.infer<typeof photoSchema>) {
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": values.image.type,
        },
        body: values.image,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      await createPhotoRequest({
        gymId: selectedGym._id,
        gymName: selectedGym.name,
        storageId,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      form.setError("image", {
        type: "manual",
        message: "Failed to upload photo. Please try again.",
      });
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
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-500/20 border border-red-500/30">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <DrawerTitle className="text-xl md:text-2xl font-bold text-white">
                  {t("photoTitle")}
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
                  className="space-y-4"
                >
                  <p className="text-sm md:text-base text-zinc-400 mb-4">
                    {t("photoDescription")}
                  </p>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <div>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              className="hidden"
                            />
                            <Input
                              ref={cameraInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              capture="user"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {previewUrl ? (
                    <div className="relative">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 h-auto rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white text-sm font-medium"
                        >
                          <ImagePlus className="w-4 h-4" />
                          {t("changePhoto")}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemovePhoto}
                          className="flex items-center justify-center px-4 py-3 h-auto rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-colors text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-3 p-8 md:p-10 h-auto rounded-xl border-2 border-dashed border-zinc-700 hover:border-red-500/50 hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-800 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                          <ImagePlus className="w-7 h-7 md:w-8 md:h-8 text-zinc-500 group-hover:text-red-500 transition-colors" />
                        </div>
                        <span className="text-zinc-400 group-hover:text-white transition-colors font-medium">
                          {t("selectPhoto")}
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 h-auto rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors md:hidden"
                      >
                        <Camera className="w-5 h-5 text-zinc-400" />
                        <span className="text-zinc-300 font-medium">
                          {t("takePhoto")}
                        </span>
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 h-auto rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-base md:text-lg"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("uploadingPhoto")}
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

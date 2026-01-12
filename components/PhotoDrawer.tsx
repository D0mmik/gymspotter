"use client";

import { useState, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useLocale } from "@/components/LocaleProvider";
import { Camera, Send, CheckCircle, X, AlertCircle, ImagePlus, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { posthog } from "@/components/PostHogProvider";

interface PhotoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: Id<"gyms">;
  gymName: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoDrawer({ open, onOpenChange, gymId, gymName }: PhotoDrawerProps) {
  const { t } = useLocale();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.requests.generateUploadUrl);
  const createPhotoRequest = useMutation(api.requests.createPhotoRequest);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return t("errorFileSize");
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t("errorFileType");
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage("");
    setStatus("idle");
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setErrorMessage(t("errorRequired"));
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      // Create photo request in database
      await createPhotoRequest({
        gymId,
        gymName,
        storageId,
      });

      setStatus("success");

      // Track photo uploaded event
      posthog.capture("photo_uploaded", {
        gym_id: gymId,
        gym_name: gymName,
        file_type: selectedFile.type,
        file_size_bytes: selectedFile.size,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage(t("errorUpload"));
      setStatus("error");

      // Track photo upload failed event and capture exception
      posthog.capture("photo_upload_failed", {
        gym_id: gymId,
        gym_name: gymName,
        error_message: error instanceof Error ? error.message : "Unknown error",
        file_type: selectedFile?.type,
        file_size_bytes: selectedFile?.size,
      });
      posthog.captureException(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after closing
    setTimeout(() => {
      handleRemovePhoto();
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
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-500/20 border border-red-500/30">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <div>
                  <DrawerTitle className="text-xl md:text-2xl font-bold text-white">
                    {t("photoTitle")}
                  </DrawerTitle>
                  <DrawerDescription className="text-zinc-400 text-sm md:text-base">
                    {gymName}
                  </DrawerDescription>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t("thankYou")}</h3>
                <p className="text-zinc-400 mb-6">{t("thankYouMessage")}</p>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-medium"
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm md:text-base text-zinc-400 mb-4">
                  {t("photoDescription")}
                </p>

                {status === "error" && errorMessage && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
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
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white text-sm font-medium"
                      >
                        <ImagePlus className="w-4 h-4" />
                        {t("changePhoto")}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center justify-center px-4 py-3 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-colors text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Select from gallery */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-3 p-8 md:p-10 rounded-xl border-2 border-dashed border-zinc-700 hover:border-red-500/50 hover:bg-zinc-800/50 transition-colors group"
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-800 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <ImagePlus className="w-7 h-7 md:w-8 md:h-8 text-zinc-500 group-hover:text-red-500 transition-colors" />
                      </div>
                      <span className="text-zinc-400 group-hover:text-white transition-colors font-medium">
                        {t("selectPhoto")}
                      </span>
                    </button>

                    {/* Take photo with camera (mobile) */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors md:hidden"
                    >
                      <Camera className="w-5 h-5 text-zinc-400" />
                      <span className="text-zinc-300 font-medium">{t("takePhoto")}</span>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "uploading" || !selectedFile}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-base md:text-lg"
                >
                  {status === "uploading" ? (
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
                </button>
              </form>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

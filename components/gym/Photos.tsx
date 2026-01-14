import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gym } from "@/lib/types/gyms";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PhotosProps {
  selectedGym: Gym;
  handlePhotoDrawerOpen: () => void;
}

export function Photos({ selectedGym, handlePhotoDrawerOpen }: PhotosProps) {
  const t = useTranslations();

  if (selectedGym.photos && selectedGym.photos.length > 0) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {selectedGym.photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden bg-zinc-800"
            >
              <Image
                src={photo}
                alt={`${selectedGym.name} - Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center justify-center py-8 md:py-10 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
        <Camera className="w-10 h-10 md:w-12 md:h-12 text-zinc-500 mb-3" />
        <p className="text-zinc-400 text-sm md:text-base text-center mb-3">
          {t("noPhotos")}
        </p>
        <Button
          variant="ghost"
          onClick={handlePhotoDrawerOpen}
          className="text-red-500 hover:text-red-400 active:text-red-300 text-sm md:text-base font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
        >
          {t("submitPhoto")}
        </Button>
      </div>
    </div>
  );
}

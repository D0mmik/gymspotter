import { Gym } from "@/lib/types/gyms";
import { Banknote, Globe, Phone } from "lucide-react";

interface ContactProps {
  selectedGym: Gym;
}

export function Contact({ selectedGym }: ContactProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col items-start gap-3 text-sm md:text-base">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-zinc-500" />
          <a
            href={`tel:${selectedGym.phone}`}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            {selectedGym.phone}
          </a>
        </div>
        {selectedGym.website && (
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-zinc-500" />
            <a
              href={selectedGym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              {new URL(selectedGym.website).hostname.replace(/^www\./, "")}
            </a>
          </div>
        )}
        {selectedGym.singleEntryPrice !== undefined && (
          <div className="flex items-center gap-3">
            <Banknote className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-300">
              {selectedGym.singleEntryPrice} Kč
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

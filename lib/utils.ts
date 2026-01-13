import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {OpeningHours} from "@/lib/types/gyms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};

export const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export const getCurrentDay = (): typeof DAYS_ORDER[number] => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  return days[new Date().getDay()]
};

export const isGymOpen = (openingHours: OpeningHours): boolean => {
  const now = new Date();
  const currentDay = getCurrentDay();
  const dayHours = openingHours[currentDay];

  if (dayHours.closed) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = dayHours.open.split(":").map(Number);
  const [closeHour, closeMin] = dayHours.close.split(":").map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime < closeTime;
};

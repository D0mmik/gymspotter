"use client";

import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Map, { Marker, ViewState, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { User, Camera, Copy, Globe, Phone, AlertTriangle, Banknote } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { PhotoDrawer } from "@/components/PhotoDrawer";
import { ReportDrawer } from "@/components/ReportDrawer";
import { translations } from "@/lib/i18n";
import { useFeatureFlag, posthog } from "@/components/PostHogProvider";
import { Button } from "@/components/ui/button";

const PRAGUE_CENTER = {
  longitude: 14.4378,
  latitude: 50.0755,
};

const INITIAL_VIEWSTATE: ViewState = {
  longitude: PRAGUE_CENTER.longitude,
  latitude: PRAGUE_CENTER.latitude,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

type DayHours = {
  open: string;
  close: string;
  closed?: boolean;
};

type OpeningHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

type Gym = {
  _id: Id<"gyms">;
  _creationTime: number;
  name: string;
  address: string;
  openingHours?: OpeningHours;
  phone: string;
  website?: string;
  longitude: number;
  latitude: number;
  photos: string[];
  multisport?: boolean;
  singleEntryPrice?: number;
};

// Days of week in order
const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

// Get current day of week
const getCurrentDay = (): typeof DAYS_ORDER[number] => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  return days[new Date().getDay()] as typeof DAYS_ORDER[number];
};

// Check if gym is currently open
const isGymOpen = (openingHours: OpeningHours): boolean => {
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

export interface GymMapRef {
  centerOnLocation: () => void;
}

interface GymMapProps {
  multisportFilter: boolean | null; // null = all, true = multisport only, false = no multisport
}

export const GymMap = forwardRef<GymMapRef, GymMapProps>(({ multisportFilter }, ref) => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEWSTATE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
  const [reportDrawerOpen, setReportDrawerOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const { t, isReady } = useLocale();
  const isLocationEnabled = useFeatureFlag("user-location");

  const allGyms = useQuery(api.gyms.getAll);
  
  // Filter gyms based on multisport filter
  const gyms = allGyms?.filter((gym) => {
    if (multisportFilter === null) return true;
    return gym.multisport === multisportFilter;
  });

  // Show notification toast to user
  const showNotificationToUser = (message: string, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  // Copy address to clipboard
  const copyAddress = async (address: string, gymName: string, gymId: string) => {
    try {
      await navigator.clipboard.writeText(address);
      showNotificationToUser(t("addressCopied"), 2000);

      // Track address copy event
      posthog.capture("gym_details_address_copied", {
        gym_id: gymId,
        gym_name: gymName,
        address: address,
      });
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  // Handle gym marker click
  const handleGymMarkerClick = (gym: Gym) => {
    setSelectedGym(gym);
    setDrawerOpen(true);

    // Track gym marker clicked event
    posthog.capture("gym_marker_clicked", {
      gym_id: gym._id,
      gym_name: gym.name,
      gym_address: gym.address,
      has_photos: gym.photos && gym.photos.length > 0,
      is_open: gym.openingHours ? isGymOpen(gym.openingHours) : true, // null openingHours means 24/7
      multisport: gym.multisport,
    });

    // Fly to the gym location
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [gym.longitude, gym.latitude],
        duration: 800,
      });
    }
  };

  // Handle photo submit drawer open
  const handlePhotoDrawerOpen = () => {
    setPhotoDrawerOpen(true);

    // Track photo submit drawer opened event
    if (selectedGym) {
      posthog.capture("photo_submit_drawer_opened", {
        gym_id: selectedGym._id,
        gym_name: selectedGym.name,
      });
    }
  };

  // Handle phone click
  const handlePhoneClick = (gym: Gym) => {
    posthog.capture("gym_phone_clicked", {
      gym_id: gym._id,
      gym_name: gym.name,
      phone: gym.phone,
    });
  };

  // Handle website click
  const handleWebsiteClick = (gym: Gym) => {
    posthog.capture("gym_website_clicked", {
      gym_id: gym._id,
      gym_name: gym.name,
      website: gym.website,
    });
  };

  // Handle report drawer open
  const handleReportDrawerOpen = () => {
    setReportDrawerOpen(true);

    if (selectedGym) {
      posthog.capture("report_drawer_opened", {
        gym_id: selectedGym._id,
        gym_name: selectedGym.name,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    centerOnLocation: () => {
      // Check if location feature is enabled
      if (!isLocationEnabled) {
        return;
      }

      if (!navigator.geolocation) {
        showNotificationToUser(t("locationNotSupported"));
        return;
      }

      // Show loading state
      showNotificationToUser(t("locationLoading"));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };
          setUserLocation(location);
          setNotification(null); // Clear loading message

          // Track user location centered event
          posthog.capture("user_location_centered", {
            latitude: location.latitude,
            longitude: location.longitude,
          });

          // Use flyTo to properly interrupt any ongoing movement
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [location.longitude, location.latitude],
              duration: 1000,
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          
          // Show appropriate error message
          switch (error.code) {
            case error.PERMISSION_DENIED:
              showNotificationToUser(t("locationDenied"));
              break;
            case error.POSITION_UNAVAILABLE:
              showNotificationToUser(t("locationUnavailable"));
              break;
            case error.TIMEOUT:
              showNotificationToUser(t("locationTimeout"));
              break;
            default:
              showNotificationToUser(t("locationUnavailable"));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    },
  }));

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  if (!mapboxToken) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          {isReady && (
            <>
              <p className="text-red-500 font-semibold">{t("mapboxRequired")}</p>
              <p className="text-zinc-400 mt-2 text-sm">{t("addMapboxToken")}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (allGyms === undefined) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          {isReady && <p className="text-zinc-400 mt-4 text-sm">{t("loading")}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[100dvh] w-full">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          attributionControl={false}
        >
          {isLocationEnabled && userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="bottom"
            >
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"
              >
                <User className="w-3 h-3 text-white" />
              </div>
            </Marker>
          )}

          {gyms.map((gym) => (
            <Marker
              key={gym._id}
              longitude={gym.longitude}
              latitude={gym.latitude}
              anchor="bottom"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGymMarkerClick(gym);
                }}
                className="cursor-pointer hover:scale-110 transition-transform flex flex-col items-center gap-1"
              >
                <div
                  className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg"
                />
                {viewState.zoom >= 13 && (
                  <span className="text-xs font-medium text-white bg-zinc-900/80 px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg backdrop-blur-sm">
                    {gym.name}
                  </span>
                )}
              </button>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Notification toast */}
      {notification && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-xl bg-zinc-800/95 border border-zinc-700/50 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)" }}
        >
          <p className="text-sm text-white text-center whitespace-nowrap">
            {notification}
          </p>
        </div>
      )}

      {selectedGym && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[85vh] md:max-h-[80vh] flex flex-col">
            <div className="mx-auto w-full max-w-lg flex flex-col h-full overflow-hidden">
              <DrawerHeader className="text-left flex-shrink-0">
                <DrawerTitle className="text-2xl md:text-3xl font-bold text-red-500">
                  {selectedGym.name}
                </DrawerTitle>
                <DrawerDescription asChild>
                  <Button
                    variant="ghost"
                    onClick={() => copyAddress(selectedGym.address, selectedGym.name, selectedGym._id)}
                    className="flex items-center justify-center gap-2 text-zinc-400 text-sm md:text-base hover:text-zinc-300 hover:bg-transparent transition-colors cursor-pointer group w-full h-auto"
                  >
                    <span>{selectedGym.address}</span>
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </DrawerDescription>
                <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto">
                  {selectedGym.openingHours ? (
                    <span
                      className={`text-sm md:text-base font-medium whitespace-nowrap ${
                        isGymOpen(selectedGym.openingHours) ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isGymOpen(selectedGym.openingHours) ? t("open") : t("closed")}
                    </span>
                  ) : (
                    <span className="text-sm md:text-base font-medium text-green-400 whitespace-nowrap">{t("open24_7")}</span>
                  )}
                  {selectedGym.multisport !== undefined && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          selectedGym.multisport
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-700/50 text-zinc-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedGym.multisport ? "bg-green-500" : "bg-zinc-500"}`} />
                        {selectedGym.multisport ? t("multisportYes") : t("multisportNo")}
                      </span>
                    </>
                  )}
                </div>
              </DrawerHeader>

              <div className="px-4 pb-6 md:pb-8 overflow-y-auto flex-1">
                {/* Photos Gallery */}
                <div className="mb-6">
                  {selectedGym.photos && selectedGym.photos.length > 0 ? (
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
                  ) : (
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
                  )}
                </div>

                {/* Opening Hours - only show if not 24/7 */}
                {selectedGym.openingHours && (
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                      {t("openingHours")}
                    </h3>
                    <div className="space-y-2">
                      {DAYS_ORDER.map((day) => {
                        const dayHours = selectedGym.openingHours![day];
                        const isToday = getCurrentDay() === day;
                        return (
                          <div
                            key={day}
                            className={`flex items-center py-2 px-3 rounded-lg ${
                              isToday ? "bg-red-500/10 border border-red-500/30" : ""
                            }`}
                          >
                            <span className={`text-sm md:text-base w-1/3 ${isToday ? "text-red-500 font-medium" : "text-zinc-400"}`}>
                              {t(day as keyof typeof translations.cs)}
                            </span>
                            <span className={`text-sm md:text-base w-1/3 text-center ${isToday ? "text-white font-medium" : "text-zinc-300"}`}>
                              {dayHours.closed ? t("closed") : `${dayHours.open} - ${dayHours.close}`}
                            </span>
                            <span className="text-xs w-1/3 text-right text-red-500">
                              {isToday && t("today")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="flex flex-col items-start gap-3 text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-500 w-16">{t("phone")}</span>
                    <a
                      href={`tel:${selectedGym.phone}`}
                      onClick={() => handlePhoneClick(selectedGym)}
                      className="text-zinc-300 hover:text-white transition-colors"
                    >
                      {selectedGym.phone}
                    </a>
                  </div>
                  {selectedGym.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-500 w-16">{t("website")}</span>
                      <a
                        href={selectedGym.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleWebsiteClick(selectedGym)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        {new URL(selectedGym.website).hostname.replace(/^www\./, '')}
                      </a>
                    </div>
                  )}
                  {selectedGym.singleEntryPrice !== undefined && (
                    <div className="flex items-center gap-3">
                      <Banknote className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-zinc-500 whitespace-nowrap">{t("singleEntry")}</span>
                      <span className="text-zinc-300 whitespace-nowrap">{selectedGym.singleEntryPrice} Kč</span>
                    </div>
                  )}
                </div>

                {/* Report Error Button */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <Button
                    variant="ghost"
                    onClick={handleReportDrawerOpen}
                    className="flex items-center gap-2 text-zinc-500 hover:text-amber-500 hover:bg-transparent transition-colors text-sm h-auto p-0"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {t("reportError")}
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {selectedGym && (
        <PhotoDrawer
          open={photoDrawerOpen}
          onOpenChange={setPhotoDrawerOpen}
          gymId={selectedGym._id}
          gymName={selectedGym.name}
        />
      )}

      {selectedGym && (
        <ReportDrawer
          open={reportDrawerOpen}
          onOpenChange={setReportDrawerOpen}
          gymId={selectedGym._id}
          gymName={selectedGym.name}
        />
      )}
    </>
  );
});

GymMap.displayName = "GymMap";

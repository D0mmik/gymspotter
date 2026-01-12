"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import Map, { Marker, ViewState } from "react-map-gl/mapbox";
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
import { User } from "lucide-react";

// Prague coordinates - City center (average of all gyms)
const PRAGUE_CENTER = {
  longitude: 14.4378,
  latitude: 50.0755,
};

const INITIAL_VIEWSTATE: ViewState = {
  longitude: PRAGUE_CENTER.longitude,
  latitude: PRAGUE_CENTER.latitude,
  zoom: 11.5, // Good zoom level to see Prague city area
  pitch: 0,
  bearing: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

type Gym = {
  _id: Id<"gyms">;
  _creationTime: number;
  name: string;
  address: string;
  description: string;
  hours: string;
  phone: string;
  rating: number;
  longitude: number;
  latitude: number;
  photos: string[];
};

export interface GymMapRef {
  centerOnLocation: () => void;
}

export const GymMap = forwardRef<GymMapRef>((props, ref) => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEWSTATE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);

  const gyms = useQuery(api.gyms.getAll);

  useImperativeHandle(ref, () => ({
    centerOnLocation: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            };
            setUserLocation(location);
            setViewState({
              ...viewState,
              ...location,
              zoom: 14,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            setViewState({
              ...viewState,
              longitude: PRAGUE_CENTER.longitude,
              latitude: PRAGUE_CENTER.latitude,
              zoom: 11.5,
            });
          }
        );
      }
    },
  }));

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  if (!mapboxToken) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Mapbox token required</p>
          <p className="text-zinc-400 mt-2 text-sm">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
          </p>
        </div>
      </div>
    );
  }

  if (gyms === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-zinc-400 mt-4 text-sm">Loading gyms...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          attributionControl={false}
        >
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="bottom"
            >
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"
                style={{
                  transform: "translate(-50%, -50%)",
                }}
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
                  setSelectedGym(gym);
                  setDrawerOpen(true);
                }}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <div
                  className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </button>
            </Marker>
          ))}
        </Map>
      </div>

      {selectedGym && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl font-bold text-red-500">
                {selectedGym.name}
              </DrawerTitle>
              <DrawerDescription className="text-zinc-400">
                {selectedGym.address}
              </DrawerDescription>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{selectedGym.rating}</span>
                <span className="text-zinc-500 text-sm">•</span>
                <span className="text-sm text-zinc-400">{selectedGym.hours}</span>
              </div>
            </DrawerHeader>

            <div className="px-4 pb-4 overflow-y-auto">
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {selectedGym.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800"
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  About
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedGym.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm w-20">Phone:</span>
                  <a
                    href={`tel:${selectedGym.phone}`}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    {selectedGym.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-zinc-500 text-sm w-20">Hours:</span>
                  <span className="text-zinc-300 text-sm">{selectedGym.hours}</span>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
});

GymMap.displayName = "GymMap";

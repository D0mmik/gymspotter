"use client";

import {useState, useRef} from "react";
import Map, {ViewState, MapRef} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Gym} from "@/lib/types/gyms";
import {GymDrawer} from "@/components/gym/GymDrawer";
import {GymMarker} from "@/components/GymMarker";
import {useTranslations} from "next-intl";

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
    padding: {top: 0, bottom: 0, left: 0, right: 0},
};

interface GymMapProps {
    multisportFilter: boolean;
}

export const GymMap = ({multisportFilter}: GymMapProps) => {
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEWSTATE);
    const [gymDrawerOpen, setGymDrawerOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
    const mapRef = useRef<MapRef>(null);
    const t = useTranslations();

    const allGyms = useQuery(api.gyms.getAll);

    const gyms = allGyms?.filter((gym) => {
        if (!multisportFilter) return true;
        return gym.multisport === multisportFilter;
    });

    const handleGymMarkerClick = (gym: Gym) => {
        setSelectedGym(gym);
        setGymDrawerOpen(true);

        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [gym.longitude, gym.latitude],
                duration: 800,
            });
        }
    };

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    if (allGyms === undefined) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                    <p className="text-zinc-400 mt-4 text-sm">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 w-full h-full">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapboxAccessToken={mapboxToken}
                    style={{width: "100%", height: "100%"}}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    attributionControl={false}
                >
                    {gyms?.map((gym) => (
                        <GymMarker
                            key={gym._id}
                            selectedGym={gym}
                            viewState={viewState}
                            handleGymMarkerClick={handleGymMarkerClick}
                        />
                    ))}
                </Map>
            </div>
            {selectedGym && (
                <GymDrawer
                    open={gymDrawerOpen}
                    onOpenChange={setGymDrawerOpen}
                    selectedGym={selectedGym}
                />
            )}
        </>
    );
}
GymMap.displayName = "GymMap";
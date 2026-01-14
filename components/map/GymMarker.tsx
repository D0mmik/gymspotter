import {Gym} from "@/lib/types/gyms";
import {Marker, ViewState} from "react-map-gl/mapbox";

interface GymMarkerProps {
    selectedGym: Gym;
    handleGymMarkerClick: (gym: Gym) => void;
    viewState: ViewState;
}

export function GymMarker({handleGymMarkerClick, selectedGym, viewState}: GymMarkerProps) {
    return <Marker
        longitude={selectedGym.longitude}
        latitude={selectedGym.latitude}
        anchor="bottom"
    >
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleGymMarkerClick(selectedGym);
            }}
            className="cursor-pointer hover:scale-110 transition-transform flex flex-col items-center gap-1"
        >
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg"/>
            {viewState.zoom >= 13 && (
                <span
                    className="text-xs font-medium text-white bg-zinc-900/80 px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg backdrop-blur-sm">
                    {selectedGym.name}
                </span>
            )}
        </button>
    </Marker>
}
import {Id} from "@/convex/_generated/dataModel";

export type DayHours = {
    open: string;
    close: string;
    closed?: boolean;
};

export type OpeningHours = {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
};

export type Gym = {
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
    multisport: boolean;
    singleEntryPrice?: number;
    rackCount?: number;
    dumbbellMaxKg?: number;
    hasDeadliftPlatform?: boolean;
    hasMagnesium?: boolean;
    hasAirCon?: boolean;
    hasParking?: boolean;
};
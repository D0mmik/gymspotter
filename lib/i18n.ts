"use client"
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
    cs: {
        // Header
        appName: "Your Gym Spotter",
        location: "Praha",

        // Buttons
        addGym: "Přidat",
        showMyLocation: "Moje poloha",

        // Drawer
        phone: "Telefon",
        website: "Web",
        hours: "Otevírací doba:",
        addressCopied: "Adresa zkopírována",

        // Photos placeholder
        noPhotos: "Znáte toto místo? Pošlete nám fotku!",
        submitPhoto: "Odeslat fotku →",

        // Loading
        loading: "Načítání fitcenter...",
        mapboxRequired: "Vyžadován Mapbox token",
        addMapboxToken: "Přidejte NEXT_PUBLIC_MAPBOX_TOKEN do .env.local",

        // Language
        switchLanguage: "EN",

        // Location
        locationLoading: "Hledám polohu...",
        locationDenied: "Poloha zamítnuta. Povol přístup v nastavení.",
        locationUnavailable: "Poloha není dostupná.",
        locationTimeout: "Vypršel čas pro získání polohy.",
        locationNotSupported: "Tvůj prohlížeč nepodporuje geolokaci.",

        // Add gym form
        addGymTitle: "Přidat fitcentrum",
        addGymDescription: "Znáš fitko, které tu chybí? Řekni nám o něm!",
        gymName: "Název fitcentra",
        gymNamePlaceholder: "např. Fitness XY",
        gymAddress: "Adresa",
        gymAddressPlaceholder: "např. Vinohradská 123, Praha 2",
        gymNote: "Poznámka (volitelné)",
        gymNotePlaceholder: "Otevírací doba, typ fitka, co se ti líbí...",
        send: "Odeslat",
        sending: "Odesílám...",
        thankYou: "Děkujeme!",
        thankYouMessage: "Fitko brzy přidáme.",
        close: "Zavřít",

        // Photo form
        photoTitle: "Odeslat fotku",
        photoDescription: "Pomoz ostatním vidět, jak to tam vypadá!",
        selectPhoto: "Vybrat fotku",
        takePhoto: "Vyfotit",
        changePhoto: "Změnit fotku",
        uploadingPhoto: "Nahrávám fotku...",
        photoSelected: "Fotka vybrána",

        // Errors
        errorGeneric: "Něco se pokazilo. Zkus to znovu.",
        errorFileSize: "Fotka je moc velká. Maximum je 10 MB.",
        errorFileType: "Neplatný formát. Použij JPG, PNG nebo WebP.",
        errorUpload: "Nahrávání selhalo. Zkus to znovu.",
        errorRequired: "Vyplň všechna povinná pole.",

        // Days of week
        monday: "Pondělí",
        tuesday: "Úterý",
        wednesday: "Středa",
        thursday: "Čtvrtek",
        friday: "Pátek",
        saturday: "Sobota",
        sunday: "Neděle",
        closed: "Zavřeno",
        open: "Otevřeno",
        openingHours: "Otevírací doba",
        today: "Dnes",
        open24_7: "Otevřeno 24/7",
        alwaysOpen: "Nonstop",

        // Multisport
        multisport: "MultiSport",
        multisportYes: "Přijímá MultiSport",
        multisportNo: "Nepřijímá MultiSport",

        // Price
        singleEntry: "Jednorázový vstup",

        // Filter
        filter: "Filtr",
        filterMultisport: "Pouze MultiSport",
        filterAll: "Všechny",

        // Report
        reportError: "Nahlásit chybu",
        reportTitle: "Nahlásit chybu",
        reportDescription: "Našli jste chybu v údajích? Napište nám, co je špatně.",
        reportPlaceholder: "Popište, co je špatně (např. špatná adresa, otevírací doba...)",
        reportSuccess: "Děkujeme za nahlášení!",

        // Equipment
        equipment: "Vybavení",
        rackCount: "Počet racků",
        dumbbellMaxKg: "Max. jednoručky",
        hasDeadliftPlatform: "Deadlift platforma",
        hasMagnesium: "Magnézium",
        hasAirCon: "Klimatizace",
        hasParking: "Parkování",
        yes: "Ano",
        no: "Ne",
        noEquipmentInfo: "Byl/a jsi tady? Pomoz nám doplnit info!",
        addEquipmentInfo: "Byl/a jsi tady? Doplň vybavení →",
        equipmentDescription: "Vyplň, co víš. Všechna pole jsou volitelná.",
        equipmentSuccess: "Díky za doplnění! Brzy to zkontrolujeme.",
        equipmentNotePlaceholder: "Poznámka (např. jiné vybavení, stav, ...)",
    },
    en: {
        // Header
        appName: "Your Gym Spotter",
        location: "Prague",

        // Buttons
        addGym: "Add",
        showMyLocation: "My location",

        // Drawer
        phone: "Phone",
        website: "Website",
        hours: "Hours:",
        addressCopied: "Address copied",

        // Photos placeholder
        noPhotos: "Know this place? Send us a pic!",
        submitPhoto: "Submit a photo →",

        // Loading
        loading: "Loading gyms...",
        mapboxRequired: "Mapbox token required",
        addMapboxToken: "Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local",

        // Language
        switchLanguage: "CZ",

        // Location
        locationLoading: "Finding location...",
        locationDenied: "Location denied. Enable access in settings.",
        locationUnavailable: "Location unavailable.",
        locationTimeout: "Location request timed out.",
        locationNotSupported: "Your browser doesn't support geolocation.",

        // Add gym form
        addGymTitle: "Add a gym",
        addGymDescription: "Know a gym that's missing? Tell us about it!",
        gymName: "Gym name",
        gymNamePlaceholder: "e.g. Fitness XY",
        gymAddress: "Address",
        gymAddressPlaceholder: "e.g. Vinohradská 123, Prague 2",
        gymNote: "Note (optional)",
        gymNotePlaceholder: "Opening hours, gym type, what you like...",
        send: "Send",
        sending: "Sending...",
        thankYou: "Thank you!",
        thankYouMessage: "We'll add it soon.",
        close: "Close",

        // Photo form
        photoTitle: "Submit a photo",
        photoDescription: "Help others see what it looks like!",
        selectPhoto: "Select photo",
        takePhoto: "Take photo",
        changePhoto: "Change photo",
        uploadingPhoto: "Uploading photo...",
        photoSelected: "Photo selected",

        // Errors
        errorGeneric: "Something went wrong. Please try again.",
        errorFileSize: "Photo is too large. Maximum is 10 MB.",
        errorFileType: "Invalid format. Use JPG, PNG or WebP.",
        errorUpload: "Upload failed. Please try again.",
        errorRequired: "Please fill in all required fields.",

        // Days of week
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
        closed: "Closed",
        open: "Open",
        openingHours: "Opening Hours",
        today: "Today",
        open24_7: "Open 24/7",
        alwaysOpen: "Always Open",

        // Multisport
        multisport: "MultiSport",
        multisportYes: "Accepts MultiSport",
        multisportNo: "No MultiSport",

        // Price
        singleEntry: "Single entry",

        // Filter
        filter: "Filter",
        filterMultisport: "MultiSport only",
        filterAll: "All",

        // Report
        reportError: "Report error",
        reportTitle: "Report an error",
        reportDescription: "Found incorrect information? Let us know what's wrong.",
        reportPlaceholder: "Describe what's wrong (e.g. wrong address, opening hours...)",
        reportSuccess: "Thanks for reporting!",

        // Equipment
        equipment: "Equipment",
        rackCount: "Rack count",
        dumbbellMaxKg: "Max. dumbbells",
        hasDeadliftPlatform: "Deadlift platform",
        hasMagnesium: "Chalk/Magnesium",
        hasAirCon: "Air conditioning",
        hasParking: "Parking",
        yes: "Yes",
        no: "No",
        noEquipmentInfo: "Been here? Help us complete the info!",
        addEquipmentInfo: "Been here? Add equipment info →",
        equipmentDescription: "Fill in what you know. All fields are optional.",
        equipmentSuccess: "Thanks for contributing! We'll review it soon.",
        equipmentNotePlaceholder: "Note (e.g. other equipment, condition, ...)",
    },
}

  i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

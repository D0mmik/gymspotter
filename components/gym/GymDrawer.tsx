"use client";

import {useState} from "react";
import {
    Drawer,
    DrawerContent, DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {AlertTriangle, Copy, DotIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {copyText} from "@/lib/utils";
import {Gym} from "@/lib/types/gyms";
import {Photos} from "@/components/gym/Photos";
import {Contact} from "@/components/gym/Contact";
import {OpeningHoursInfo} from "@/components/gym/OpeningHours";
import {EquipmentInfo} from "@/components/gym/Equipment";
import {PhotoDrawer} from "@/components/PhotoDrawer";
import {ReportDrawer} from "@/components/ReportDrawer";
import {EquipmentDrawer} from "@/components/EquipmentDrawer";
import {toast} from "sonner";
import {MultisportBadge} from "@/components/gym/MultisportBadge";
import {OpenStatusBadge} from "@/components/gym/OpenStatusBadge";
import {useTranslations} from "next-intl";

interface GymDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedGym: Gym;
}

export function GymDrawer({open, onOpenChange, selectedGym}: GymDrawerProps) {
    const t = useTranslations();
    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
    const [reportDrawerOpen, setReportDrawerOpen] = useState(false);
    const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);

    async function copyAddress() {
        await copyText(selectedGym.address);
        toast.success(t('addressCopied'), {position: "bottom-center"});
    }

    return (
        <>
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[85vh] md:max-h-[80vh] flex flex-col">
                    <div className="mx-auto w-full max-w-lg flex flex-col h-full overflow-hidden">
                        <DrawerHeader className="text-left shrink-0">
                            <DrawerTitle className="text-2xl md:text-3xl font-bold text-red-500">
                                {selectedGym.name}
                            </DrawerTitle>
                            <DrawerDescription asChild>
                                <Button
                                    onClick={() => copyAddress()}
                                    className="bg-transparent flex items-center justify-center gap-2 text-zinc-400 text-sm md:text-base hover:text-zinc-300 hover:bg-transparent transition-colors cursor-pointer group w-full h-auto"
                                >
                                    {selectedGym.address}
                                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </Button>
                            </DrawerDescription>
                            <div className="flex items-center justify-center mt-2">
                                <OpenStatusBadge openingHours={selectedGym.openingHours}/>
                                <DotIcon className="text-zinc-600" size={20}></DotIcon>
                                <MultisportBadge multisport={selectedGym.multisport}/>
                            </div>
                        </DrawerHeader>

                        <div className="px-4 pb-6 md:pb-8 overflow-y-auto flex-1">
                            <Photos selectedGym={selectedGym} handlePhotoDrawerOpen={() => setPhotoDrawerOpen(true)}/>
                            <OpeningHoursInfo openingHours={selectedGym.openingHours}/>
                            <EquipmentInfo selectedGym={selectedGym} onOpenChange={() => setEquipmentDrawerOpen(true)}/>
                            <Contact selectedGym={selectedGym}/>

                            <div className="pt-6 border-t border-zinc-800">
                                <Button
                                    variant="default"
                                    onClick={() => setReportDrawerOpen(true)}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-amber-500 hover:bg-transparent bg-transparent text-sm h-auto p-0"
                                >
                                    <AlertTriangle className="w-4 h-4"/>
                                    {t('reportError')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {selectedGym && (
                <PhotoDrawer
                    open={photoDrawerOpen}
                    onOpenChange={setPhotoDrawerOpen}
                    selectedGym={selectedGym}
                />
            )}

            {selectedGym && (
                <ReportDrawer
                    open={reportDrawerOpen}
                    onOpenChange={setReportDrawerOpen}
                    selectedGym={selectedGym}
                />
            )}

            {selectedGym && (
                <EquipmentDrawer
                    open={equipmentDrawerOpen}
                    onOpenChange={setEquipmentDrawerOpen}
                    selectedGym={selectedGym}
                />
            )}
        </>
    );
}

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Donor, DonorsContextProps } from "../objects/donor";
import { createEventAttendee, deleteEventAttendee, fetchDonorByEventId, fetchInvitedDonorsByEventId, getDonorsByFundraiser } from "@/lib/actions/donor.action";
import { getFundraiserByEvent } from "@/lib/actions/fundraiser.action";

const DonorsContext = createContext<DonorsContextProps | undefined>(undefined);

export const DonorsProvider = ({ children }) => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [fundraiserList, setFundraiserList] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitedDonors, setInvitedDonors] = useState<Set<number>>(new Set());
    const [backupDonors, setBackupDonors] = useState<Donor[]>([]);
    const [completedInvitedDonors, setCompletedInvitedDonors] = useState<number>(0);


    // Fetch donors for the event
    const fetchEventDonors = async (params: DonorProviderParams) => {
        try {
            setLoading(true);
            // const allDonors = fetchDonorByEventId({ eventId: props.eventId });
            const fundraiserIds = await fetchFundraiserByEvent({ eventId: params.eventId });
            const allDonors = [];
            for (const fundraiserId of fundraiserIds) {
                const donorsForFundraiser = await fetchDonorsByFundraiser({ fundraiserId });
                allDonors.push(...donorsForFundraiser);
            }
            setDonors(allDonors);
            setBackupDonors(allDonors);
        } catch (error) {
            console.error("Error in fetchEventDonors:", error);
        } finally {
            setLoading(false);
        }
    };
    // Fetch invited donors for the event
    const fetchInvitedDonors = async (params: DonorProviderParams) => {
        try {
            const invited = await fetchInvitedDonorsByEventId({ eventId: params.eventId });
            if (invited && Array.isArray(invited)) {
                const invitedIds = new Set(invited.map((donor) => donor.donorId));
                setInvitedDonors(invitedIds);
            } else {
                console.error("Invalid invited list structure:", invited);
            }
        } catch (error) {
            console.error("Error in fetchInvitedDonors:", error);
        }
    }

    // Toggle invitation status for the donor
    const toggleInvitation = async (params: ToggleInvitationParams) => {
        try {
            // if donor is already invited, remove the invitation
            if (invitedDonors.has(params.donorId)) {
                await deleteEventAttendee({ eventId: params.eventId, donorId: params.donorId });
                console.log("Deleted event attendee for donor", params.donorId);
                setInvitedDonors((prev) => {
                    const newInvited = new Set(prev);
                    newInvited.delete(params.donorId);
                    return newInvited;
                });
            } else {
                // if donor is not invited, invite the donor
                await generateEventAttendee({
                    donorId: params.donorId,
                    eventId: params.eventId,
                });
                setInvitedDonors((prev) => {
                    const newInvited = new Set(prev);
                    newInvited.add(params.donorId);
                    return newInvited;
                });
            }
        } catch (error) {
            console.error("Error in toggleInvitation:", error);
        }
    };

    const fetchFundraiserByEvent = async (params: GetFundraiserByEventParams) => {
        try {
            const newfundraiser = await getFundraiserByEvent(params);
            if (newfundraiser && newfundraiser.length > 0) {
                const fundraiserIds = newfundraiser.map((item) => item.fundraiserId);
                setFundraiserList(fundraiserIds);
                return fundraiserIds;
            } else {
                console.log("No fundraisers found for event", params.eventId);
                return [];
            }
        } catch (error) {
            console.error("Error in fetchFundraiser by event", error);
            return [];
        }
    }

    const fetchDonorsByFundraiser = async (params: GetDonorByFundraiserParams) => {
        try {
            const newDonorList = await getDonorsByFundraiser(params);
            return newDonorList || [];
        } catch (error) {
            console.error("Error in fetchDonorsByFundraiser", error);
            return [];
        }
    }

    const generateEventAttendee = async (params: DonorProviderParams) => {
        if (!params.donorId) {
            console.error("Donor ID is required to generate event attendee");
            return
        }
        try {
            const newEventAttendee = await createEventAttendee({
                eventId: params.eventId || 0,
                donorId: params.donorId,
                donationAmount: 0,
            });
            console.log("New Event Attendee", JSON.stringify(newEventAttendee, null, 2));

        } catch (error) {
            console.error("Error in generateEventAttendee", error);
        }
    }

    const fetchProgress = async (): Promise<void> => {
        const totalDonors = backupDonors.length;
        const completed = invitedDonors.size;
        const progress = totalDonors > 0 ? (completed / totalDonors) * 100 : 0;
        console.log("Progress", progress);
        setCompletedInvitedDonors(progress);
    }

    const sortDonrosByName = () => {
        setDonors((prev) => {
            const newDonors = [...prev].sort((a, b) =>
                a.name.localeCompare(b.name, "zh-Hans", { sensitivity: "base" })
            );
            return newDonors;
        });
    }

    const searchDonors = (query: string) => {
        if (!query) {
            setDonors(backupDonors);
            return;
        } else {
            const newDonors = backupDonors.filter((donor) => donor.name.toLowerCase().includes(query.toLowerCase()));
            setDonors(newDonors);
        }
    }

    return (
        <DonorsContext.Provider value={{
            donors,
            fundraiserList,
            loading,
            backupDonors,
            invitedDonors,
            completedInvitedDonors,
            fetchEventDonors,
            fetchInvitedDonors,
            toggleInvitation,
            fetchProgress,
            searchDonors,
            sortDonrosByName,

        }}>
            {children}
        </DonorsContext.Provider>
    );
};

export const useDonors = () => {
    const context = useContext(DonorsContext);
    if (!context) {
        throw new Error("useDonors must be used within a DonorsProvider");
    }
    return context;
}


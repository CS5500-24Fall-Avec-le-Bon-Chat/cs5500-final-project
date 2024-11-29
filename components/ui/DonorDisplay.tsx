import React, { ToggleEventHandler, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';
import { Donor, User } from '@prisma/client';
import { getFundraiserByEvent } from '@/lib/actions/fundraiser.action';
import { checkDonorInEvent, createEventAttendee, deleteEventAttendee, fetchDonorsByEventId, getDonorsByFundraiser } from '@/lib/actions/donor.action';
import { set } from 'zod';

export const DonorDisplay = (props: DonorDisplayProps) => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [fundraiserList, setFundraiserList] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitedDonors, setInvitedDonors] = useState<Set<number>>(new Set());

    // Fetch donors for the event
    const fetchEventDonors = async () => {
        try {
            setLoading(true);
            const fundraiserIds = await fetchFundraiserByEvent({ eventId: props.eventId });
            const allDonors = [];
            for (const fundraiserId of fundraiserIds) {
                const donorsForFundraiser = await fetchDonorsByFundraiser({ fundraiserId });
                allDonors.push(...donorsForFundraiser);
            }
            setDonors(allDonors);
        } catch (error) {
            console.error("Error in fetchEventDonors:", error);
        } finally {
            setLoading(false);
        }
    };
    // Fetch invited donors for the event
    const fetchInvitedDonors = async () => {
        try {
            const invited = await fetchDonorsByEventId({ eventId: props.eventId });
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
                await generateEventAttendee({ donorId: params.donorId });
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

    const generateEventAttendee = async (params: GenerateEventDonorsParams) => {
        if (!params.donorId) {
            console.error("Donor ID is required to generate event attendee");
            return
        }
        try {
            const newEventAttendee = await createEventAttendee({
                eventId: props.eventId,
                donorId: params.donorId,
                donationAmount: 0,
            });
            console.log("New Event Attendee", JSON.stringify(newEventAttendee, null, 2));

        } catch (error) {
            console.error("Error in generateEventAttendee", error);
        }
    }

    useEffect(() => {
        fetchEventDonors();
        fetchInvitedDonors();
    }, [props.eventId]);


    return (
        <Card className="shadow-none mb-4">
            <CardHeader>
                <CardTitle>Donors for {props.eventId}</CardTitle>
            </CardHeader>
            <CardContent>
                <>
                    <div className="flex gap-2 mb-4">
                        <Button
                        // onClick={() =>
                        //   setSelectedEvent((prev) => {
                        //     const donors = prev.donors.sort((a, b) =>
                        //       a.name.localeCompare(b.name, "zh-Hans", {
                        //         sensitivity: "base",
                        //       }),
                        //     );
                        //     return { ...prev, donors };
                        //   })
                        // }
                        >
                            Sort by Name
                        </Button>
                    </div>
                    <ScrollArea className="">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b font-semibold">Name</th>
                                    {/* <th className="p-2 border-b font-semibold">
                                        Communication Preference
                                    </th> */}
                                    <th className="p-2 border-b font-semibold text-center">
                                        Invited
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {donors.map((donor, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-2 border-b">
                                            <Link href={`/donor?name=${donor.name}`}>
                                                {donor.name}
                                            </Link>
                                        </td>
                                        <td className="p-2 border-b text-center">
                                            <input
                                                type="checkbox"
                                                checked={invitedDonors.has(donor.id)}
                                                onChange={() => toggleInvitation({ eventId: props.eventId, donorId: donor.id })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollArea>
                </>
            </CardContent>
        </Card>
    )
}


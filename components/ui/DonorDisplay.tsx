import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';
import { Input } from './input';
import { useDonors } from './DonorProvider';

export const DonorDisplay = (props: DonorDisplayProps) => {
    const {
        donors,
        fetchEventDonors,
        fetchInvitedDonors,
        toggleInvitation,
        invitedDonors,
        sortDonrosByName,
        searchDonors,
    } = useDonors();

    useEffect(() => {
        fetchEventDonors({ eventId: props.eventId });
        fetchInvitedDonors({ eventId: props.eventId });
    }, [props.eventId]);


    return (
        <Card className="shadow-none mb-4">
            <CardHeader>
                <CardTitle>Donors</CardTitle>
            </CardHeader>
            <CardContent>
                <>
                    <div className="flex gap-2 mb-4">
                        <Button
                            onClick={sortDonrosByName}
                        >
                            Sort by Name
                        </Button>
                        <Input
                            type="text"
                            placeholder="Search Donor"
                            className="w-1/2"
                            onChange={(e) => searchDonors(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b font-semibold">Name</th>
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


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { eventFormSchema } from "@/lib/utils";
import { z } from "zod";
import { createEvent, createEventFundraiser, deleteEvent } from "@/lib/actions/event.action";
import FontSizeAndTheme from "./FontSizeAndTheme";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";

enum City {
    VICTORIA = "Victoria",
    NANAIMO = "Nanaimo",
    COURTENAY = "Courtenay",
    PARKSVILLE = "Parksville",
    CAMPBELL_RIVER = "Campbell River",
    SAANICH = "Saanich",
    VANCOUVER = "Vancouver",
    SURREY = "Surrey",
    BURNABY = "Burnaby",
    RICHMOND = "Richmond",
}

const EventForm = ({ type }: { type: string }) => {

    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [date, setDate] = useState("");
    const [city, setCity] = useState<City | "">("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState(0);
    const eventSchema = eventFormSchema(type);
    const [fundraisers, setFundraisers] = useState([]);
    const [selectedFundraisers, setSelectedFundraisers] = useState<string[]>([]);

    const onSubmitEvent = async (data: z.infer<typeof eventSchema>) => {
        try {
            const eventData = {
                title: title!,
                topic: topic!,
                date: date!,
                city: city.toUpperCase().replace(' ', '_') as keyof typeof City,
                address: address!,
                description: description!,
                goal: parseFloat(goal.toString()),
                completed: 0.0,
            }
            const newEvent = await createEvent(eventData);
            setEvent(newEvent);
            alert("Event has been created successfully");
            return newEvent;

        } catch (error) {
            console.error(error);
        }
    };


    const onSubmit = async () => {
        let newEvent = null;

        try {
            // Start the event creation process
            newEvent = await onSubmitEvent({
                title,
                topic,
                date,
                city,
                address,
                description,
                goal,
                completed: 0,
            });

            if (!newEvent || !newEvent.id) {
                throw new Error("Event creation failed or event ID is missing.");
            }

            console.log("Event created successfully:", newEvent);

            // Attempt to link fundraisers to the event
            const fundraiserResponses = [];
            for (const fundraiserId of selectedFundraisers) {
                const response = await createEventFundraiser({
                    eventId: newEvent.id,
                    fundraiserId: Number(fundraiserId),
                });
                fundraiserResponses.push(response);
            }

            console.log("All fundraisers linked successfully:", fundraiserResponses);

            // If everything is successful, reload the page
            alert("Event and fundraisers created successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error during event creation process:", error);

            // Rollback logic
            if (newEvent && newEvent.id) {
                console.warn("Rolling back: Deleting the created event...");
                try {
                    await deleteEvent(newEvent.id); // Add a deleteEvent API call in your backend
                    console.log("Rollback successful: Event deleted.");
                } catch (rollbackError) {
                    console.error("Rollback failed: Unable to delete event.", rollbackError);
                }
            }

            alert("An error occurred during the event creation process. Please try again.");
        }
    };

    const fetchFundraisers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            setFundraisers(data);
            console.log("fundraiser", fundraisers);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchFundraisers();
    }, []);



    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <FontSizeAndTheme />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/fundraiser">Fundraiser</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Create Event</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>
            {/* Event Details Card */}
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Create Event</CardTitle>
                    <CardDescription>Enter the event information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Event Title */}
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event Title"
                            className="w-full"
                        />
                        {/* Event Topic */}
                        <Input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Event Topic"
                            className="w-full"
                        />
                        {/* Event Date */}
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value.toString())}
                            placeholder="Event Date"
                            className="w-full"
                        />
                        {/* City Dropdown */}
                        <div className="w-full">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700"></label>
                            <select
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value as City)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a City</option>
                                {Object.values(City).map((cityOption) => (
                                    <option key={cityOption} value={cityOption}>
                                        {cityOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Event Address */}
                        <Input
                            type="text"
                            value={address}
                            placeholder="Event Address"
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full"
                        />
                        {/* Event Description */}
                        <Textarea
                            placeholder="Event Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24"
                        />

                        {/* Choose Fundraiser multiple choose*/}
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Choose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fundraisers.map((fundraiser) => (
                                    <tr
                                        key={fundraiser.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="border border-gray-300 px-4 py-2">{fundraiser.name}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 rounded"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedFundraisers((prev) => [...new Set([...prev, fundraiser.id as string])]);
                                                    } else {
                                                        setSelectedFundraisers((prev) =>
                                                            prev.filter((id) => id !== fundraiser.id)
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        {/* Fundraising Goal */}
                        <Input
                            type="number"
                            value={goal || ""} // Show empty string if goal is not set
                            onChange={(e) => setGoal(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Set a goal for the event"
                            className="w-full"
                        />

                    </div>
                </CardContent>
            </Card>

            {/* Create Event Button */}
            <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => { onSubmit() }}
                disabled={selectedFundraisers.length === 0}
            >
                Create Event
            </Button>
        </div>
    );
}

export default EventForm;

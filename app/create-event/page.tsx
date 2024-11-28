"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

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

export default function CreateEventPage() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState<City | "">(""); // Default is empty
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);

  const router = useRouter();

  const handleCreateEvent = () => {
    const newEvent = {
      id: id || Date.now().toString(), // Use input ID or fallback to a timestamp
      title,
      topic,
      date,
      city,
      description,
      goal,
    };

    // Get existing events from localStorage or initialize with an empty array
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    // Add the new event to the array
    events.push(newEvent);

    // Save the updated events array back to localStorage
    localStorage.setItem("events", JSON.stringify(events));

    // Redirect to the fundraiser page
    router.push("/fundraiser");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Event Details Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Enter the event information below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Event ID (optional) */}
            <Input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Event ID (optional)"
              className="w-full"
            />
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
              onChange={(e) => setDate(e.target.value)}
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
            {/* Event Description */}
            <Textarea
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24"
            />
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
        onClick={handleCreateEvent}
      >
        Create Event
      </Button>
    </div>
  );
}

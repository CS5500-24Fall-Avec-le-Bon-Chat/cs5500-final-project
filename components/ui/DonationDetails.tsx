"use client";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Event } from "@/components/objects/event";
import Link from "next/link";
import CircularProgress from "@/components/CircularProgress"; // Import the CircularProgress component
import FontSizeAndTheme from "@/components/ui/FontSizeAndTheme";
import { getEvents } from "@/lib/actions/event.action";
import TasksDisplay from "./TasksDisplay";
import { TasksProvider, useTasks } from "./TasksProvider";
import { DonorDisplay } from "./DonorDisplay";
import { useDonors } from "./DonorProvider";

export default function donationDetails() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>({} as Event);
  const [view, setView] = useState("tasks"); // State to toggle between tasks and donors
  const [, setLoading] = useState(false); // Loading state for fetching data
  const [username, setUsername] = useState("");

  const {completedTasksPercentage} = useTasks();
  const { completedInvitedDonors, fetchProgress, donors, invitedDonors} = useDonors();

  const calculateGoalProgress = () => {
    const completed = selectedEvent.completed; // The amount completed
    const target = selectedEvent.goal; // The total target goal
    // Calculate the percentage progress
    return (completed / target) * 100;
  };


  // Fetch username from localStorage
  const fetchUserName = () => {
    setUsername(localStorage.getItem("username") || "");
  }

  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      const events = await getEvents();
      setEvents(events);
      if (events.length > 0) {
        setSelectedEvent(events[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // format the date
  const formatDate = (date: string) => {
    return date ? date.split("T")[0]: "";
  };


  useEffect(() => {
    fetchEvents();
    fetchUserName();
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [donors, invitedDonors]);

  return (
    <div className="flex mt-32 mx-auto max-w-6xl flex-col gap-8">
      <>
        <FontSizeAndTheme />
      </>
      {/* Breadcrumb Navigation */}
      <div className="flex justify-between items-center px-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Fundraiser</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-sm">Welcome, {username}!</div>
      </div>
      {/* Main Content */}
      <div className="flex">
        {/* Event List Column */}
        <div className="w-1/6 p-4">
          {/* Create Event Button */}
          <Link href="/create-event">
            <Button variant="outline" className="w-full mb-4">
              Create Event
            </Button>
          </Link>
          <ScrollArea className="max-h-[59.2vh] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <ul>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="cursor-pointer hover:bg-gray-200 p-2 mb-2 rounded text-left "
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.title}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        {/* Event Details Column */}
        <div className="w-5/12 p-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{selectedEvent.title}</CardTitle>
              <CardDescription>{selectedEvent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Theme:</strong> {selectedEvent.topic}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedEvent.date)}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.city}
              </p>
              <p>
                <strong>Address:</strong> {selectedEvent.address}
              </p>
              <p>
                <strong>Goal: $</strong> {selectedEvent.goal}
              </p>
              <p>
                <strong>Completed:</strong>
              </p>
              {/* Goal Circle */}
              {/* <div className="flex justify-center items-center mt-8">
                <CircularProgress
                  progress={calculateGoalProgress()}
                  size={120} // Size of the circle
                  strokeWidth={10} // Stroke width of the circle
                />
              </div> */}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setView("tasks")}
              >
                List of Tasks
              </Button>
              <div className="mt-4">
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${completedTasksPercentage()}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setView("donors")}
              >
                List of Donors
              </Button>
              <div className="mt-4">
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${completedInvitedDonors}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {view === "tasks" && <TasksDisplay eventId={selectedEvent.id} />}
        {view === "donors" && <DonorDisplay eventId={selectedEvent.id} />}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import {
  events as defaultEventList,
  Event,
  Task,
} from "@/components/objects/event";
import {
  DonorAPIResponse,
  transformDonorData,
} from "@/components/objects/donor";
import Link from "next/link";
import FontSizeAndTheme from "@/components/ui/FontSizeAndTheme";

export default function FundraiserPage() {
  const [events, setEvents] = useState<Event[]>(defaultEventList); // Initialize with defaultEventList
  const [selectedEvent, setSelectedEvent] = useState<Event>(
    defaultEventList[0],
  );

  const [tasks, setTasks] = useState<Task[]>(selectedEvent.tasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [view, setView] = useState("tasks"); // State to toggle between tasks and donors
  const [, setLoading] = useState(false); // Loading state for fetching data
  const [, setInvitedCount] = useState(
    selectedEvent.donors.filter((donor) => donor.invited).length,
  );
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Update localStorage whenever events change
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    // Access localStorage only on the client side
    setUsername(localStorage.getItem("username") || "");
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(parsedEvents);
      setSelectedEvent(parsedEvents[0]); // Update selectedEvent based on stored events
    }
  }, []);

  const calculateInvitedCount = useCallback(() => {
    return selectedEvent.donors.filter((donor) => donor.invited).length;
  }, [selectedEvent]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const regenerateDonors = async () => {
    setLoading(true);
    const location = selectedEvent.location;
    const url = `https://bc-cancer-faux.onrender.com/event?cities=${location}&format=csv`;

    try {
      const response = await fetch(url);
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result: { data: DonorAPIResponse[] }) => {
          const donorData = transformDonorData(result.data);

          // Update donors for the selected event
          const updatedEvent = { ...selectedEvent, donors: donorData };
          setSelectedEvent(updatedEvent);

          const updatedEvents = events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          );
          setEvents(updatedEvents);

          // Update invited count
          const initialInvitedCount = donorData.filter(
            (donor) => donor.invited,
          ).length;
          setInvitedCount(initialInvitedCount);
        },
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedEvent.donors || selectedEvent.donors.length === 0) {
      regenerateDonors(); // Fetch only if no donors exist
    }
  }, [selectedEvent]);

  // Toggle invitation status of a donor within the selected event
  const toggleInvitation = (index: number) => {
    const updatedDonors = selectedEvent.donors.map((donor, i) =>
      i === index ? { ...donor, invited: !donor.invited } : donor,
    );

    // Update selectedEvent with the new donors array
    const updatedEvent = { ...selectedEvent, donors: updatedDonors };
    setSelectedEvent(updatedEvent);

    // Reflect changes in the global events array
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event,
    );
    setEvents(updatedEvents);
  };

  useEffect(() => {
    setTasks(selectedEvent.tasks);
  }, [selectedEvent]);

  // Update the events array to reflect changes to selectedEvent tasks
  const updateEventTasks = (updatedTasks: Task[]) => {
    const updatedEvent = { ...selectedEvent, tasks: updatedTasks };
    setSelectedEvent(updatedEvent);

    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event,
    );
    setEvents(updatedEvents);
  };

  // Function to add a new task to the selected event
  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText,
        status: "undone" as const,
      };
      const updatedTasks = [...tasks, newTask];
      updateEventTasks(updatedTasks);
      setNewTaskText("");
    }
  };

  // Toggle task status within the selected event
  const toggleTaskStatus = (taskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newStatus: "undone" | "done" =
          task.status === "undone" ? "done" : "undone";
        return { ...task, status: newStatus };
      }
      return task;
    });
    updateEventTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    updateEventTasks(updatedTasks);
  };

  // Function to calculate task completion progress
  const calculateProgress = () => {
    const doneTasks = tasks.filter((task) => task.status === "done").length;
    return (doneTasks / tasks.length) * 100;
  };

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
            <BreadcrumbItem>
              <BreadcrumbLink href="/staff">Staff</BreadcrumbLink>
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
          <ScrollArea className="h-48">
            <ul>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="cursor-pointer hover:bg-gray-200 p-2 mb-2 rounded text-center"
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.name}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        {/* Event Details Column */}
        <div className="w-5/12 p-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{selectedEvent.name}</CardTitle>
              <CardDescription>{selectedEvent.details}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Date:</strong> {selectedEvent.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Theme:</strong> {selectedEvent.theme}
              </p>

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
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">
                    {tasks.filter((task) => task.status === "done").length}/
                    {tasks.length}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setView("donors")}
              >
                List of Donors
              </Button>
              <Button
                variant="destructive"
                className="mt-4 ml-2"
                onClick={regenerateDonors}
              >
                Reset Donor List
              </Button>
              <div className="mt-4">
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(calculateInvitedCount() / selectedEvent.donors.length) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2">
                    {calculateInvitedCount()}/{selectedEvent.donors.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List of Tasks or List of Donors Column */}
        <div className="w-5/12 p-4">
          {view === "tasks" ? (
            <Card className="shadow-none mb-4">
              <CardHeader>
                <CardTitle>Tasks for {selectedEvent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Task Input */}
                <div className="flex items-center mb-4">
                  <Input
                    placeholder="Add your new tasks..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTask();
                      }
                    }}
                    className="mr-2"
                  />
                  <Button variant="outline" onClick={handleAddTask}>
                    Add
                  </Button>
                </div>

                <ul>
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center mb-2 group relative hover:bg-gray-100 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="mr-2"
                      />
                      <span
                        className={
                          task.status === "done"
                            ? "line-through text-gray-500"
                            : task.status === "in-progress"
                              ? "text-gray-700"
                              : ""
                        }
                      >
                        {task.text}
                      </span>
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white text-red-500 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-none mb-4">
              <CardHeader>
                <CardTitle>Donors for {selectedEvent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <>
                  <div className="flex gap-2 mb-4">
                    <Button
                      onClick={() =>
                        setSelectedEvent((prev) => {
                          const donors = prev.donors.sort((a, b) =>
                            a.name.localeCompare(b.name, "zh-Hans", {
                              sensitivity: "base",
                            }),
                          );
                          return { ...prev, donors };
                        })
                      }
                    >
                      Sort by Name
                    </Button>
                    <Button
                      onClick={() =>
                        setSelectedEvent((prev) => {
                          const donors = prev.donors.sort((a, b) =>
                            a.communicationPreference.localeCompare(
                              b.communicationPreference,
                            ),
                          );
                          return { ...prev, donors };
                        })
                      }
                    >
                      Sort by Preference
                    </Button>
                  </div>
                  <ScrollArea className="">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border-b font-semibold">Name</th>
                          <th className="p-2 border-b font-semibold">
                            Communication Preference
                          </th>
                          <th className="p-2 border-b font-semibold text-center">
                            Invited
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.donors.map((donor, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-2 border-b">
                              <Link href={`/donor?name=${donor.name}`}>
                                {donor.name}
                              </Link>
                            </td>
                            <td className="p-2 border-b">
                              {donor.communicationPreference}
                            </td>
                            <td className="p-2 border-b text-center">
                              <input
                                type="checkbox"
                                checked={donor.invited}
                                onChange={() => toggleInvitation(index)}
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
          )}
        </div>
      </div>
    </div>
  );
}

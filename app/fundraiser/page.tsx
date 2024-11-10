"use client";
import { useState, useEffect, useRef } from "react";
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
import Papa from 'papaparse';


export default function FundraiserPage() {
  const events = [
    {
      id: 1,
      name: "Event 1",
      details: "Details for Event 1",
      date: "2024/11/10",
      time: "14:00:00",
      location: "Victoria",
      theme: "Community Outreach",
      tasks: 14,
      totalTasks: 20,
      donors: 3,
      totalDonors: 15,
    },
    {
      id: 2,
      name: "Event 2",
      details: "Details for Event 2",
      date: "2024/12/05",
      time: "18:30:00",
      location: "Vancouver",
      theme: "Environmental Awareness",
      tasks: 10,
      totalTasks: 20,
      donors: 5,
      totalDonors: 15,
    },
    {
      id: 3,
      name: "Event 3",
      details: "Details for Event 3",
      date: "2024/12/20",
      time: "09:00:00",
      location: "Nanaimo",
      theme: "Health and Wellness",
      tasks: 18,
      totalTasks: 20,
      donors: 12,
      totalDonors: 15,
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [view, setView] = useState("tasks"); // State to toggle between tasks and donors
  const [donors, setDonors] = useState([]); // State to store donor data
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [invitedCount, setInvitedCount] = useState(0); // Count of invited donors


  useEffect(() => {
    if (view === "donors") {
      fetchDonors();
    }
  }, [view, selectedEvent]);

  const fetchDonors = async () => {
    setLoading(true);
    const location = selectedEvent.location;
    const url = `https://bc-cancer-faux.onrender.com/event?cities=${location}&format=csv`;
    try {
      const response = await fetch(url);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result: { data: boolean[]; }) => {
          const donorData = result.data.map(donor => ({
            name: `${donor.first_name} ${donor.last_name}`,
            communicationPreference: donor.communication_preference,
            invited: false, // Default unchecked
          }));
          setDonors(donorData);
        },
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInvitation = (index) => {
    setDonors(prevDonors => {
      const updatedDonors = prevDonors.map((donor, i) =>
        i === index ? { ...donor, invited: !donor.invited } : donor
      );
      const newInvitedCount = updatedDonors.filter(donor => donor.invited).length;
      setInvitedCount(newInvitedCount);
      return updatedDonors;
    });
  };


  const [tasks, setTasks] = useState([
    { id: 1, text: "undone task1", status: "undone" },
    { id: 2, text: "undone task2", status: "undone" },
    { id: 3, text: "in progress task1", status: "in progress" },
    { id: 4, text: "task done1", status: "done" },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTaskText, status: "undone" }]);
      setNewTaskText("");
    }
  };

  // Function to toggle task status
  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "undone"
          ? "done"
          : task.status === "done"
            ? "in-progress"
            : "undone";
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const calculateProgress = () => {
    const doneTasks = tasks.filter(task => task.status === "done").length;
    return (doneTasks / tasks.length) * 100;
  };

  function CustomCheckbox({ checked, indeterminate, onChange }) {
    const checkboxRef = useRef(null);

    useEffect(() => {
      if (!checkboxRef.current) {
        return;
      }
      checkboxRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <input
        type="checkbox"
        ref={checkboxRef}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
    );
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex mt-32 mx-auto max-w-6xl flex-col gap-8">
      {/* Breadcrumb Navigation */}
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
              <p><strong>Date:</strong> {selectedEvent.date}</p>
              <p><strong>Time:</strong> {selectedEvent.time}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Theme:</strong> {selectedEvent.theme}</p>

              <Button variant="outline" className="mt-4" onClick={() => setView("tasks")}>
                List of Tasks
              </Button>
              <div className="mt-4">
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{width: `${calculateProgress()}%`}}
                    ></div>
                  </div>
                  <span className="ml-2">{tasks.filter(task => task.status === "done").length}/{tasks.length}</span>
                </div>
              </div>

              <Button variant="outline" className="mt-4" onClick={() => setView("donors")}>
                List of Donors
              </Button>
              <div className="mt-4 flex items-center mt-2">

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{width: `${(invitedCount / donors.length) * 100}%`}}
                    ></div>
                  </div>
                  <span className="ml-2">{invitedCount}/{donors.length}</span>
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
                  <Button variant="outline" onClick={handleAddTask}>Add</Button>
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
                    <Button onClick={() => setDonors([...donors].sort((a, b) => a.name.localeCompare(b.name)))}>Sort by
                      Name</Button>
                    <Button
                      onClick={() => setDonors([...donors].sort((a, b) => a.communicationPreference.localeCompare(b.communicationPreference)))}>Sort
                      by Preference</Button>
                  </div>
                  <ScrollArea className="h-48">
                    <table className="w-full text-left">
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Communication Preference</th>
                        <th>Invited</th>
                      </tr>
                      </thead>
                      <tbody>
                      {donors.map((donor, index) => (
                        <tr key={index}>
                          <td>{donor.name}</td>
                          <td>{donor.communicationPreference}</td>
                          <td>
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
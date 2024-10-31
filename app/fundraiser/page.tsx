"use client";
import { useState } from "react";

export default function FundraiserPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, name: "Event 1", details: "Details for Event 1", tasks: 14, totalTasks: 20, donors: 3, totalDonors: 15 },
    { id: 2, name: "Event 2", details: "Details for Event 2", tasks: 10, totalTasks: 20, donors: 5, totalDonors: 15 },
    { id: 3, name: "Event 3", details: "Details for Event 3", tasks: 18, totalTasks: 20, donors: 12, totalDonors: 15 },
  ];

  return (
    <div className="flex justify-center mt-64 mx-auto w-3/4 max-w-2xl flex-col gap-5">
      <h2>Fundraiser Page</h2>
      <p>This page will have 3 vertical columns.</p>
      <div className="flex">
        <div className="w-1/6 p-4 border">
          <h3>Event List</h3>
          <ul>
            {events.map((event) => (
              <li
                key={event.id}
                className="cursor-pointer hover:bg-gray-200 p-2 mb-2 bg-blue-500 text-white rounded text-center"
                onClick={() => setSelectedEvent(event)}
              >
                {event.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-5/12 p-4 border">
          <h3>Event Details</h3>
          {selectedEvent ? (
            <div>
              <h4>{selectedEvent.name}</h4>
              <p>{selectedEvent.details}</p>
              <button className="mt-4 p-2 bg-blue-500 text-white rounded">List of Tasks</button>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(selectedEvent.tasks / selectedEvent.totalTasks) * 100}%` }}></div>
                </div>
                <span className="ml-2">{selectedEvent.tasks}/{selectedEvent.totalTasks}</span>
              </div>
              <button className="mt-4 p-2 bg-blue-500 text-white rounded">List of Donors</button>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(selectedEvent.donors / selectedEvent.totalDonors) * 100}%` }}></div>
                </div>
                <span className="ml-2">{selectedEvent.donors}/{selectedEvent.totalDonors}</span>
              </div>
            </div>
          ) : (
            <p>Please select an event from the list.</p>
          )}
        </div>
        <div className="w-5/12 p-4 border">
          <h3>List of Tasks or List of Donors</h3>
          {/* Conditionally render list of tasks or list of donors here */}
        </div>
      </div>
    </div>
  );
}

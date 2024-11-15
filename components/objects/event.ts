// components/objects/Event.ts
import { Donor } from "./donor";

export interface Task {
  id: number;
  text: string;
  status: "undone" | "in-progress" | "done";
}

export interface Event {
  id: number;
  name: string;
  details: string;
  date: string;
  time: string;
  location: string;
  theme: string;
  tasks: Task[];
  donors: Donor[];
  donorTarget?: number;
}

export const events: Event[] = [
  {
    id: 1,
    name: "Event 1",
    details: "Details for Event 1",
    date: "2024/11/10",
    time: "14:00:00",
    location: "Victoria",
    theme: "Community Outreach",
    tasks: [
      { id: 1, text: "Task 1", status: "undone" },
      { id: 2, text: "Task 2", status: "in-progress" },
      { id: 3, text: "Task 3", status: "done" },
    ],
    donors: [],
    donorTarget: 10
  },
  {
    id: 2,
    name: "Event 2",
    details: "Details for Event 2",
    date: "2024/12/05",
    time: "18:30:00",
    location: "Vancouver",
    theme: "Environmental Awareness",
    tasks: [
      { id: 1, text: "Task 1", status: "undone" },
      { id: 2, text: "Task 2", status: "in-progress" },
      { id: 3, text: "Task 3", status: "done" },
    ],
    donors: [],
    donorTarget: 20
  },
  {
    id: 3,
    name: "Event 3",
    details: "Details for Event 3",
    date: "2024/12/20",
    time: "09:00:00",
    location: "Nanaimo",
    theme: "Health and Wellness",
    tasks: [
      { id: 1, text: "Task 1", status: "undone" },
      { id: 2, text: "Task 2", status: "in-progress" },
      { id: 3, text: "Task 3", status: "done" },
    ],
    donors: [],
    donorTarget: 15
  },
];
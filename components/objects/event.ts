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
    id: 1, // Unique identifier
    name: "Shop by Donation",
    date: "November 17th", // Event date
    time: "11:00 AM - 5:00 PM", // Event time
    location: "Nanaimo", // Replace with the actual location
    theme: "Supporting Breast Cancer Research",
    details: `
   Professional makeup and hair artists often end up with a lot of product
   (cosmetics, hair care, skin care) and tools (brushes, combs, hot tools)
   that are unopened or lightly used, and we simply don’t need them anymore!
   On November 17th from 11 AM – 5 PM, we will be hosting a “shop by donation” event,
   where event attendees can come and snatch up new and lightly used professional
   hair and makeup and leave a donation of their choice as payment.
   All donations will go towards breast cancer research and care.
 `,
    donors: [], // Initialize with an empty donor list
    tasks: [
      { id: 1, text: "Set up venue", status: "undone" },
      { id: 2, text: "Arrange products", status: "undone" },
      { id: 3, text: "Create promotional materials", status: "undone" },
      { id: 4, text: "Prepare donation boxes", status: "undone" },
      { id: 5, text: "Coordinate with volunteers", status: "undone" },
    ], // Example task list for the event
  },
  {
    id: 2, // Unique identifier
    name: "Beat The Crap Out of Cancer XV",
    date: "November 11th-12th", // Event date
    time: "9:00 AM - 6:00 PM", // Event time
    location: "Vancouver", // Event location
    theme: "Fundraising Through Armed Combatives",
    details: `
   BTCOOC XV is an armed combatives fundraising event that promotes non-competitive sparring with various weapons.
   Fighters and teams register and raise funds for BC Cancer, and all proceeds go toward cancer research and care.
   Participants choose their opponents, weapons, and rules for their bouts, ensuring a safe and enjoyable experience.
   Southeast Asian and Western martial arts enthusiasts are welcome to join and support this global event.
 `,
    donors: [], // Initialize with an empty donor list
    tasks: [
      { id: 1, text: "Set up sparring zones", status: "undone" },
      { id: 2, text: "Coordinate with referees", status: "undone" },
      {
        id: 3,
        text: "Prepare participant registration desk",
        status: "undone",
      },
      { id: 4, text: "Distribute promotional materials", status: "undone" },
      { id: 5, text: "Set up donation booths", status: "undone" },
      {
        id: 6,
        text: "Organize safety equipment for participants",
        status: "undone",
      },
    ], // Example task list for the event
  },
  {
    id: 3, // Unique identifier
    name: "Stache Bash",
    date: "November 28th", // Event date
    time: "7:00 PM - 11:00 PM", // Event time
    location: "Victoria", // Event location
    theme: "Movember Fundraiser",
    details: `
   The 4th annual Movember Stache Bash supports prostate clinic research and care at BC Cancer - Victoria.
   Enjoy $25 hot shaves, live music, auctions, and more, all for a great cause.
   Proceeds fund advancements in cancer research, care, and clinical trials at BC Cancer.
 `,
    donors: [], // Initialize with an empty donor list
    tasks: [
      { id: 1, text: "Organize auction items", status: "undone" },
      { id: 2, text: "Coordinate with pub staff", status: "undone" },
      { id: 3, text: "Set up donation booths", status: "undone" },
      { id: 4, text: "Prepare live music schedule", status: "undone" },
      { id: 5, text: "Promote event on social media", status: "undone" },
      { id: 6, text: "Arrange shaving station setup", status: "undone" },
    ], // Example task list for the event
  },
];

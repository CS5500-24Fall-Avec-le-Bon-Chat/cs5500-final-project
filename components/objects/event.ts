// components/objects/Event.ts
import { Donor } from "./donor";
import { Task } from "./task";

export interface Event {
  id: number;
  title: string;
  topic: string;
  date: string;
  city: string;
  address: string;
  description: string;
  goal: number;
  completed: number;
  tasks: Task[];
  donors: Donor[];
}

export interface Events {
  events: Event[];
}

// export const events: Event[] = [
//   {
//     id: 1, // Unique identifier
//     title: "Shop by Donation",
//     topic: "Supporting Breast Cancer Research",
//     date: "November 17th",
//     city: "Vancouver",
//     address: "73 E Cordova St",
//     description: `
//    Professional makeup and hair artists often end up with a lot of product
//    (cosmetics, hair care, skin care) and tools (brushes, combs, hot tools)
//    that are unopened or lightly used, and we simply don’t need them anymore!
//    On November 17th from 11 AM – 5 PM, we will be hosting a “shop by donation” event,
//    where event attendees can come and snatch up new and lightly used professional
//    hair and makeup and leave a donation of their choice as payment.
//    All donations will go towards breast cancer research and care.
//  `,
//     donors: [], // Initialize with an empty donor list
//     tasks: [
//       { id: 1, text: "Set up venue", status: "undone" },
//       { id: 2, text: "Arrange products", status: "undone" },
//       { id: 3, text: "Create promotional materials", status: "undone" },
//       { id: 4, text: "Prepare donation boxes", status: "undone" },
//       { id: 5, text: "Coordinate with volunteers", status: "undone" },
//     ], 
//     goal: 10000.00, // Fundraising goal
//     completed: 5000.00 // Example task list for the event// Example task list for the event
//   },
//   {
//     id: 2, // Unique identifier
//     title: "Beat The Crap Out of Cancer XV",
//     date: "November 11th-12th", // Event date
//     city: "Vancouver", // Event location
//     topic: "Fundraising Through Armed Combatives",
//     address: "Academie Duello, 412 West Hastings",
//     description: `
//    BTCOOC XV is an armed combatives fundraising event that promotes non-competitive sparring with various weapons.
//    Fighters and teams register and raise funds for BC Cancer, and all proceeds go toward cancer research and care.
//    Participants choose their opponents, weapons, and rules for their bouts, ensuring a safe and enjoyable experience.
//    Southeast Asian and Western martial arts enthusiasts are welcome to join and support this global event.
//  `,
//     donors: [], // Initialize with an empty donor list
//     tasks: [
//       { id: 1, text: "Set up sparring zones", status: "undone" },
//       { id: 2, text: "Coordinate with referees", status: "undone" },
//       {
//         id: 3,
//         text: "Prepare participant registration desk",
//         status: "undone",
//       },
//       { id: 4, text: "Distribute promotional materials", status: "undone" },
//       { id: 5, text: "Set up donation booths", status: "undone" },
//       {
//         id: 6,
//         text: "Organize safety equipment for participants",
//         status: "undone",
//       },
//     ],
//     goal: 10000.00, // Fundraising goal
//     completed: 500.00 // Example task list for the event
//   },
//   {
//     id: 3, // Unique identifier
//     title: "Stache Bash",
//     date: "November 28th", // Event date
//     city: "Victoria", // Event location
//     topic: "Movember Fundraiser",
//     address: "Darcy's Pub",
//     description: `
//    The 4th annual Movember Stache Bash supports prostate clinic research and care at BC Cancer - Victoria.
//    Enjoy $25 hot shaves, live music, auctions, and more, all for a great cause.
//    Proceeds fund advancements in cancer research, care, and clinical trials at BC Cancer.
//  `,
//     donors: [], // Initialize with an empty donor list
//     tasks: [
//       { id: 1, text: "Organize auction items", status: "undone" },
//       { id: 2, text: "Coordinate with pub staff", status: "undone" },
//       { id: 3, text: "Set up donation booths", status: "undone" },
//       { id: 4, text: "Prepare live music schedule", status: "undone" },
//       { id: 5, text: "Promote event on social media", status: "undone" },
//       { id: 6, text: "Arrange shaving station setup", status: "undone" },
//     ], 
//     goal: 10000.00, // Fundraising goal
//     completed: 1230.00 // Example task list for the event// Example task list for the event
//   },
// ];

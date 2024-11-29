import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {z} from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: number) {
  return new Date(time * 1000).toLocaleString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(",", "")
}

export const eventFormSchema = (type: string) => z.object({
  title: z.string(),
  topic: z.string(),
  date: z.string(),
  city: z.string(),
  address: z.string(),
  description: z.string(),
  goal: z.number(),
  completed: z.number(),
})


import { City } from "@prisma/client";

export interface CreateEventParams {
    title: string;
    topic: string;
    date: Date;
    city: City;
    address?: string;
    description?: string;
    goal: number;
    completed: number;
}

export interface GetEventsFilterParams {
    id?: number;
    title?: string;
    city?: City;
    topic?: string;
    date?: Date;
}

export interface GetEventByIdParams {
    id: number;
}

export interface PatchEventParams {
    id: number;
    title?: string;
    topic?: string;
    date?: Date;
    city?: City;
    address?: string;
    description?: string;
    goal?: number;
    completed?: number;
}

export interface DeleteEventParams {
    id: number;
}
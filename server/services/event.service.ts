import { City, PrismaClient } from "@prisma/client";
import { 
    CreateEventParams, 
    DeleteEventParams, 
    GetEventByIdParams, 
    GetEventsFilterParams, 
    PatchEventParams 
} from "@/server/types/event.types";

const prisma = new PrismaClient();


///////////// Event table///////////// 
export class EventService {
    // As a coordinator, create a new event
    // As a fundraiser, hold a new event
    // The input param - fundraiserId is the id of the user who is holding the event not the user who is creating the event.
    static async createEvent(params: CreateEventParams) {
        const { title, topic, date, city, address, description, goal, completed } = params;
        if (!title || !topic || !date || !city || typeof goal !== 'number' || typeof completed !== 'number') {
            throw new Error("Missing required fields");
        }

        try {
            const event = await prisma.event.create({
                data: {
                    title: title,
                    topic: topic,
                    date: date,
                    city: city,
                    address: address || null,
                    description: description || null,
                    goal: goal,
                    completed: completed,
                },
            });
            return event;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to create event");
        }
    }

    static async getAllEvents() {
        try {
            const events = await prisma.event.findMany();
            return events;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get events");
        }
    }

    // Get events by title, topic, date, city, or fundraiserId
    static async getEventsByFilter(filter: GetEventsFilterParams) {
        const { title, topic, date, city} = filter;
        const data: { title?: string, topic?: string, date?: Date, city?: City, fundraiserId?: number } = {};
        if (title) data.title = title;
        if (topic) data.topic = topic;
        if (date) data.date = date;
        if (city) data.city = city;

        try {
            const events = await prisma.event.findMany({
                where: data,
            });
            return events;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get events");
        }
    }

    static async getEventById(param: GetEventByIdParams) {
        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: param.id,
                },
            });
            if (!event) {
                throw new Error("Event not found");
            }
            return event;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to get event");
        }
    }

    static async patchEvent(params: PatchEventParams) {
        const { id, title, topic, date, city, address, description, goal, completed } = params;
        if (!id) {
            throw new Error("Event id is required");
        }
        const data: { title?: string, topic?: string, date?: Date, city?: City, address?: string, description?: string, fundraiserId?: number, goal?: number, completed?: number } = {};
        if (title) data.title = title;
        if (topic) data.topic = topic;
        if (date) data.date = date;
        if (city) data.city = city;
        if (address) data.address = address;
        if (description) data.description = description;
        if (goal) data.goal = goal;
        if (completed) data.completed = completed;

        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: id,
                },
            });

            if (!event) {
                throw new Error("Event not found");
            }

            const updatedEvent = await prisma.event.update({
                where: {
                    id: id,
                },
                data: data,
            });
            return updatedEvent;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to update event");
        }
    }

    static async deleteEvent(param: DeleteEventParams) {
        try {
            // if the event does not exist, prisma will throw an error
            const event = await prisma.event.findUnique({
                where: {
                    id: param.id,
                },
            });

            if (!event) {
                throw new Error("Event not found");
            }

            await prisma.event.delete({
                where: {
                    id: param.id,
                },
            });
            return event;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to delete event");
        }
    }
}

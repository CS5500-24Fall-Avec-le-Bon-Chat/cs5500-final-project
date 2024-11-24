import { PrismaClient } from "@prisma/client";
import {
    CreateEventAttendeeParams,
    CreateManyEventAttendeeParams,
    DeleteEventAttendeeByEventIdParams,
    DeleteEventAttendeeParams,
    GetEventAttendeeByFilterParams,
    GetEventAttendeeIdParams,
    PatchEventAttendeeParams
} from "../types/eventAttendee.types";


const prisma = new PrismaClient();

export class EventAttendeeService {
    // Create a EventAttendee
    static async createEventAttendee(params: CreateEventAttendeeParams) {
        const { eventId, donorId, amount } = params;

        if (!eventId || !donorId) {
            throw new Error("Missing required fields");
        }

        try {
            const eventAttendee = await prisma.eventAttendee.create({
                data: {
                    eventId: eventId,
                    donorId: donorId,
                    amount: amount || 0,
                },
            });

            return eventAttendee;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to create eventAttendee");
        }
    }

    // Create many EventAttendees
    static async createManyEventAttendees(params: CreateManyEventAttendeeParams) {
        const { eventAttendees } = params;

        // Find existing attendees by name
        const existingAttendees = await prisma.eventAttendee.findMany({
            where: {
                donorId: {
                    in: eventAttendees.map(eventAttendee => eventAttendee.donorId),
                },
            },
        });

        // Filter out existing attendees
        const existingAttendeesIds = new Set(existingAttendees.map(donor => donor.donorId));
        const newAttendeesData = eventAttendees.filter(eventAttendee => !existingAttendeesIds.has(eventAttendee.donorId));

        // Create new attendees
        try {
            const newAttendess = await prisma.eventAttendee.createMany({
                data: newAttendeesData,
            });
            return newAttendess;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create eventAttendees");
        }
    }

    // Get all eventAttendees
    static async getAllEventAttendees() {
        try {
            const eventAttendees = await prisma.eventAttendee.findMany();
            return eventAttendees;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get eventAttendees");
        }
    }

    // Get eventAttendees by eventId or donorId
    static async getEventAttendeeByFilter(filter: GetEventAttendeeByFilterParams) {
        const { eventId, donorId } = filter;
        const data: { eventId?: number; donorId?: number } = {};
        if (eventId) data.eventId = eventId;
        if (donorId) data.donorId = donorId;

        try {
            const eventAttendees = await prisma.eventAttendee.findMany({
                where: data,
            });
            return eventAttendees;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get eventAttendee");
        }
    }

    // Get a eventAttendee by eventId and donorId
    static async getEventAttendeeId(params: GetEventAttendeeIdParams) {
        const { eventId, donorId } = params;

        try {
            const eventAttendee = await prisma.eventAttendee.findFirst({
                where: {
                    eventId: eventId,
                    donorId: donorId,
                },
            });

            if (!eventAttendee) {
                throw new Error("EventAttendee not found");
            }

            return eventAttendee.id;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to get eventAttendee");
        }
    }

    // Patch the amount of the eventAttendee
    static async patchEventAttendeeAmount(params: PatchEventAttendeeParams) {
        const { id, amount } = params;

        try {
            const eventAttendee = await prisma.eventAttendee.update({
                where: {
                    id: id,
                },
                data: {
                    amount: amount,
                },
            });

            return eventAttendee;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to patch eventAttendee");
        }
    }

    // Delete a eventAttendee
    static async deleteEventAttendee(param: DeleteEventAttendeeParams) {
        const { id } = param;

        try {
            const eventAttendee = await prisma.eventAttendee.delete({
                where: {
                    id: id,
                },
            });

            return eventAttendee;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to delete eventAttendee");
        }
    }

    // Delete all eventAttendees by eventId
    static async deleteEventAttendeesByEventId(param: DeleteEventAttendeeByEventIdParams) {
        try {
            const eventAttendees = await prisma.eventAttendee.deleteMany({
                where: {
                    eventId: param.eventId,
                },
            });

            return eventAttendees;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to delete eventAttendees");
        }
    }
}


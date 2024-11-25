import { PrismaClient } from "@prisma/client";
import { CreateEventFundraiserParams, DeleteEventFundraiserParams, getEventFundraiserByIdParams, GetEventFundraiserIdParams, GetEventFundraisersFilterParams } from "@/server/types/eventFundraiser.types";

const prisma = new PrismaClient();

export class EventFundraiserService {
    // Create a new event fundraiser
    static async createEventFundraiser(params: CreateEventFundraiserParams) {
        const { eventId, fundraiserId } = params;
        if (!eventId || !fundraiserId) {
            throw new Error("Missing required fields");
        }

        try {
            const eventFundraiser = await prisma.eventFundraiser.create({
                data: {
                    eventId: eventId,
                    fundraiserId: fundraiserId,
                },
            });
            return eventFundraiser;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to create event fundraiser");
        }
    }

    // Get all event fundraisers
    static async getAllEventFundraisers() {
        try {
            const eventFundraisers = await prisma.eventFundraiser.findMany();
            return eventFundraisers;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get event fundraisers");
        }
    }

    // Get event fundraisers by eventId or fundraiserId
    static async getEventFundraisersByFilter(filter: GetEventFundraisersFilterParams) {
        const { eventId, fundraiserId } = filter;
        const data: { eventId?: number, fundraiserId?: number } = {};
        if (eventId) data.eventId = eventId;
        if (fundraiserId) data.fundraiserId = fundraiserId;

        try {
            const eventFundraisers = await prisma.eventFundraiser.findMany({
                where: data,
            });
            return eventFundraisers;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get event fundraisers");
        }
    }

    // Get event fundraisers id by eventId and fundraiserId
    static async getEventFundraiserId(params: GetEventFundraiserIdParams) {
        const { eventId, fundraiserId } = params;
        if (!eventId || !fundraiserId) {
            throw new Error("Missing required fields");
        }

        try {
            const eventFundraiser = await prisma.eventFundraiser.findFirst({
                where: {
                    eventId: eventId,
                    fundraiserId: fundraiserId,
                },
            });
            return eventFundraiser;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get event fundraiser");
        }
    }

    // Get event fundraiser by id
    static async getEventFundraiserById(params: getEventFundraiserByIdParams) {
        const { id } = params;
        if (!id) {
            throw new Error("Missing required fields");
        }

        try {
            const eventFundraiser = await prisma.eventFundraiser.findFirst({
                where: {
                    id: id
                },
            });
            return eventFundraiser;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get event fundraiser");
        }
    }

    // Delete an event fundraiser by id
    static async deleteEventFundraiser(params: DeleteEventFundraiserParams) {
        const { id } = params;

        if (!id) {
            throw new Error("Missing required fields");
        }

        try {
            const eventFundraiser = await prisma.eventFundraiser.delete({
                where: {
                    id: id
                },
            });
            return eventFundraiser;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to delete event fundraiser");
        }
    }
}
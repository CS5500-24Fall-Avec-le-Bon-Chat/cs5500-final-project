import { PrismaClient, City } from '@prisma/client';
import { EventService } from '../server/service/event.service'; // Adjust the import path as needed

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        event: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient), City: { BURNABY: 'BURNABY', VANCOUVER: 'VANCOUVER', VICTORIA: 'VICTORIA' } };
});

const prisma = new PrismaClient();

describe('EventService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createEvent', () => {
        it('should create a new event', async () => {
            const mockEvent = {
                id: 1,
                title: 'Event Title',
                topic: 'Event Topic',
                date: new Date(),
                city: City.BURNABY,
                address: '123 Main St',
                description: 'Event Description',
                goal: 1000,
                completed: 500,
            };

            (prisma.event.create as jest.Mock).mockResolvedValue(mockEvent);

            const params = {
                title: 'Event Title',
                topic: 'Event Topic',
                date: new Date(),
                city: City.VANCOUVER,
                address: '123 Main St',
                description: 'Event Description',
                goal: 1000,
                completed: 500,
            };

            const event = await EventService.createEvent(params);

            expect(prisma.event.create).toHaveBeenCalledWith({
                data: params,
            });
            expect(event).toEqual(mockEvent);
        });

        it('should throw an error if required fields are missing', async () => {
            const params = {
                title: '',
                topic: 'Event Topic',
                date: new Date(),
                city: City.BURNABY,
                address: '123 Main St',
                description: 'Event Description',
                goal: 1000,
                completed: 500,
            };

            await expect(EventService.createEvent(params)).rejects.toThrow('Missing required fields');

            expect(prisma.event.create).not.toHaveBeenCalled();
        });

        it('should throw an error if creating event fails', async () => {
            (prisma.event.create as jest.Mock).mockRejectedValue(new Error('Failed to create event'));

            const params = {
                title: 'Event Title',
                topic: 'Event Topic',
                date: new Date(),
                city: City.BURNABY,
                address: '123 Main St',
                description: 'Event Description',
                goal: 1000,
                completed: 500,
            };

            await expect(EventService.createEvent(params)).rejects.toThrow('Failed to create event');

            expect(prisma.event.create).toHaveBeenCalledWith({
                data: params,
            });
        });
    });

    describe('getAllEvents', () => {
        it('should return all events', async () => {
            const mockEvents = [
                { id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 },
                { id: 2, title: 'Event 2', topic: 'Topic 2', date: new Date(), city: City.VICTORIA, address: '456 Elm St', description: 'Description 2', fundraiserId: 2, goal: 2000, completed: 1500 },
            ];

            (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

            const events = await EventService.getAllEvents();

            expect(prisma.event.findMany).toHaveBeenCalled();
            expect(events).toEqual(mockEvents);
        });

        it('should throw an error if fetching events fails', async () => {
            (prisma.event.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get events'));

            await expect(EventService.getAllEvents()).rejects.toThrow('Failed to get events');

            expect(prisma.event.findMany).toHaveBeenCalled();
        });
    });

    describe('getEventsByFilter', () => {
        it('should return events by filter', async () => {
            const mockEvents = [
                { id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 },
            ];

            (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

            const filter = { title: 'Event 1' };
            const events = await EventService.getEventsByFilter(filter);

            expect(prisma.event.findMany).toHaveBeenCalledWith({
                where: filter,
            });
            expect(events).toEqual(mockEvents);
        });

        it('should throw an error if fetching events by filter fails', async () => {
            (prisma.event.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get events'));

            const filter = { title: 'Event 1' };
            await expect(EventService.getEventsByFilter(filter)).rejects.toThrow('Failed to get events');

            expect(prisma.event.findMany).toHaveBeenCalledWith({
                where: filter,
            });
        });
    });

    describe('getEventById', () => {
        it('should return an event by id', async () => {
            const mockEvent = { id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);

            const params = { id: 1 };
            const event = await EventService.getEventById(params);

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(event).toEqual(mockEvent);
        });

        it('should throw an error if fetching event by id fails', async () => {
            (prisma.event.findUnique as jest.Mock).mockRejectedValue(new Error('Failed to get event'));

            const params = { id: 1 };
            await expect(EventService.getEventById(params)).rejects.toThrow('Failed to get event');

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event by id', async () => {
            const mockEvent = { id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
            (prisma.event.delete as jest.Mock).mockResolvedValue(mockEvent);

            const params = { id: 1 };
            const event = await EventService.deleteEvent(params);

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(event).toEqual(mockEvent);
        });

        it('should throw an error if the event is not found', async () => {
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            const params = { id: 1 };
            await expect(EventService.deleteEvent(params)).rejects.toThrow('Event not found');

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.delete).not.toHaveBeenCalled();
        });

        it('should throw an error if deleting event fails', async () => {
            (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 });
            (prisma.event.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete event'));

            const params = { id: 1 };
            await expect(EventService.deleteEvent(params)).rejects.toThrow('Failed to delete event');

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });
    describe('patchEvent', () => {
        it('should update an event by id', async () => {
            const mockEvent = { id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 };
            const updatedEvent = { id: 1, title: 'Updated Event', topic: 'Updated Topic', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Updated Description', fundraiserId: 1, goal: 2000, completed: 1500 };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
            (prisma.event.update as jest.Mock).mockResolvedValue(updatedEvent);

            const params = { id: 1, title: 'Updated Event', topic: 'Updated Topic', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Updated Description', fundraiserId: 1, goal: 2000, completed: 1500 };
            const event = await EventService.patchEvent(params);

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Updated Event',
                    topic: 'Updated Topic',
                    date: params.date,
                    city: City.BURNABY,
                    address: '123 Main St',
                    description: 'Updated Description',
                    goal: 2000,
                    completed: 1500,
                },
            });
            expect(event).toEqual(updatedEvent);
        });

        it('should throw an error if event id is not provided', async () => {
            const params = { title: 'Updated Event', topic: 'Updated Topic', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Updated Description', fundraiserId: 1, goal: 2000, completed: 1500 };

            await expect(EventService.patchEvent(params as any)).rejects.toThrow('Event id is required');

            expect(prisma.event.findUnique).not.toHaveBeenCalled();
            expect(prisma.event.update).not.toHaveBeenCalled();
        });

        it('should throw an error if event is not found', async () => {
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            const params = { id: 1, title: 'Updated Event', topic: 'Updated Topic', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Updated Description', fundraiserId: 1, goal: 2000, completed: 1500 };
            await expect(EventService.patchEvent(params)).rejects.toThrow('Event not found');

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.update).not.toHaveBeenCalled();
        });

        it('should throw an error if updating event fails', async () => {
            (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: 1, title: 'Event 1', topic: 'Topic 1', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Description 1', fundraiserId: 1, goal: 1000, completed: 500 });
            (prisma.event.update as jest.Mock).mockRejectedValue(new Error('Failed to update event'));

            const params = { id: 1, title: 'Updated Event', topic: 'Updated Topic', date: new Date(), city: City.BURNABY, address: '123 Main St', description: 'Updated Description', fundraiserId: 1, goal: 2000, completed: 1500 };
            await expect(EventService.patchEvent(params)).rejects.toThrow('Failed to update event');

            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(prisma.event.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Updated Event',
                    topic: 'Updated Topic',
                    date: params.date,
                    city: City.BURNABY,
                    address: '123 Main St',
                    description: 'Updated Description',
                    goal: 2000,
                    completed: 1500,
                },
            });
        });
    });
});

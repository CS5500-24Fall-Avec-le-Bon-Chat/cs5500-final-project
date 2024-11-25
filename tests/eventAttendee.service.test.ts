import { PrismaClient } from '@prisma/client';
import { EventAttendeeService } from '../server/service/eventAttendee.service'; // Adjust the import path as needed

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    eventAttendee: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('EventAttendeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEventAttendee', () => {
    it('should create a new eventAttendee', async () => {
      const mockEventAttendee = {
        id: 1,
        eventId: 1,
        donorId: 1,
        amount: 100,
      };

      (prisma.eventAttendee.create as jest.Mock).mockResolvedValue(mockEventAttendee);

      const params = {
        eventId: 1,
        donorId: 1,
        amount: 100,
      };

      const eventAttendee = await EventAttendeeService.createEventAttendee(params);

      expect(prisma.eventAttendee.create).toHaveBeenCalledWith({
        data: params,
      });
      expect(eventAttendee).toEqual(mockEventAttendee);
    });

    it('should throw an error if required fields are missing', async () => {
      const params = {
        eventId: undefined,
        donorId: 1,
        amount: 100,
      };

      await expect(EventAttendeeService.createEventAttendee(params as any)).rejects.toThrow('Missing required fields');

      expect(prisma.eventAttendee.create).not.toHaveBeenCalled();
    });

    it('should throw an error if creating eventAttendee fails', async () => {
      (prisma.eventAttendee.create as jest.Mock).mockRejectedValue(new Error('Failed to create eventAttendee'));

      const params = {
        eventId: 1,
        donorId: 1,
        amount: 100,
      };

      await expect(EventAttendeeService.createEventAttendee(params)).rejects.toThrow('Failed to create eventAttendee');

      expect(prisma.eventAttendee.create).toHaveBeenCalledWith({
        data: params,
      });
    });
  });

  describe('createManyEventAttendees', () => {
    it('should create many eventAttendees', async () => {
      const mockEventAttendees = [
        { eventId: 1, donorId: 1, amount: 100 },
        { eventId: 1, donorId: 2, amount: 200 },
      ];

      (prisma.eventAttendee.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.eventAttendee.createMany as jest.Mock).mockResolvedValue({ count: 2 });

      const params = { eventAttendees: mockEventAttendees };
      const result = await EventAttendeeService.createManyEventAttendees(params);

      expect(prisma.eventAttendee.findMany).toHaveBeenCalledWith({
        where: {
          donorId: {
            in: mockEventAttendees.map(eventAttendee => eventAttendee.donorId),
          },
        },
      });
      expect(prisma.eventAttendee.createMany).toHaveBeenCalledWith({
        data: mockEventAttendees,
      });
      expect(result).toEqual({ count: 2 });
    });

    it('should filter out existing attendees and create new ones', async () => {
      const mockEventAttendees = [
        { eventId: 1, donorId: 1, amount: 100 },
        { eventId: 1, donorId: 2, amount: 200 },
      ];

      const existingAttendees = [{ donorId: 1 }];
      (prisma.eventAttendee.findMany as jest.Mock).mockResolvedValue(existingAttendees);
      (prisma.eventAttendee.createMany as jest.Mock).mockResolvedValue({ count: 1 });

      const params = { eventAttendees: mockEventAttendees };
      const result = await EventAttendeeService.createManyEventAttendees(params);

      expect(prisma.eventAttendee.findMany).toHaveBeenCalledWith({
        where: {
          donorId: {
            in: mockEventAttendees.map(eventAttendee => eventAttendee.donorId),
          },
        },
      });
      expect(prisma.eventAttendee.createMany).toHaveBeenCalledWith({
        data: [{ eventId: 1, donorId: 2, amount: 200 }],
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('getAllEventAttendees', () => {
    it('should return all eventAttendees', async () => {
      const mockEventAttendees = [
        { id: 1, eventId: 1, donorId: 1, amount: 100 },
        { id: 2, eventId: 1, donorId: 2, amount: 200 },
      ];

      (prisma.eventAttendee.findMany as jest.Mock).mockResolvedValue(mockEventAttendees);

      const eventAttendees = await EventAttendeeService.getAllEventAttendees();

      expect(prisma.eventAttendee.findMany).toHaveBeenCalled();
      expect(eventAttendees).toEqual(mockEventAttendees);
    });

    it('should throw an error if fetching eventAttendees fails', async () => {
      (prisma.eventAttendee.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get eventAttendees'));

      await expect(EventAttendeeService.getAllEventAttendees()).rejects.toThrow('Failed to get eventAttendees');

      expect(prisma.eventAttendee.findMany).toHaveBeenCalled();
    });
  });

  describe('getEventAttendeeByFilter', () => {
    it('should return eventAttendees by filter', async () => {
      const mockEventAttendees = [
        { id: 1, eventId: 1, donorId: 1, amount: 100 },
      ];

      (prisma.eventAttendee.findMany as jest.Mock).mockResolvedValue(mockEventAttendees);

      const filter = { eventId: 1 };
      const eventAttendees = await EventAttendeeService.getEventAttendeeByFilter(filter);

      expect(prisma.eventAttendee.findMany).toHaveBeenCalledWith({
        where: filter,
      });
      expect(eventAttendees).toEqual(mockEventAttendees);
    });

    it('should throw an error if fetching eventAttendees by filter fails', async () => {
      (prisma.eventAttendee.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get eventAttendee'));

      const filter = { eventId: 1 };
      await expect(EventAttendeeService.getEventAttendeeByFilter(filter)).rejects.toThrow('Failed to get eventAttendee');

      expect(prisma.eventAttendee.findMany).toHaveBeenCalledWith({
        where: filter,
      });
    });
  });

  describe('getEventAttendeeId', () => {
    it('should return an eventAttendee id by eventId and donorId', async () => {
      const mockEventAttendee = { id: 1, eventId: 1, donorId: 1, amount: 100 };

      (prisma.eventAttendee.findFirst as jest.Mock).mockResolvedValue(mockEventAttendee);

      const params = { eventId: 1, donorId: 1 };
      const eventAttendeeId = await EventAttendeeService.getEventAttendeeId(params);

      expect(prisma.eventAttendee.findFirst).toHaveBeenCalledWith({
        where: {
          eventId: 1,
          donorId: 1,
        },
      });
      expect(eventAttendeeId).toEqual(mockEventAttendee.id);
    });

    it('should throw an error if eventAttendee is not found', async () => {
      (prisma.eventAttendee.findFirst as jest.Mock).mockResolvedValue(null);

      const params = { eventId: 1, donorId: 1 };
      await expect(EventAttendeeService.getEventAttendeeId(params)).rejects.toThrow('EventAttendee not found');

      expect(prisma.eventAttendee.findFirst).toHaveBeenCalledWith({
        where: {
          eventId: 1,
          donorId: 1,
        },
      });
    });

    it('should throw an error if fetching eventAttendee id fails', async () => {
      (prisma.eventAttendee.findFirst as jest.Mock).mockRejectedValue(new Error('Failed to get eventAttendee'));

      const params = { eventId: 1, donorId: 1 };
      await expect(EventAttendeeService.getEventAttendeeId(params)).rejects.toThrow('Failed to get eventAttendee');

      expect(prisma.eventAttendee.findFirst).toHaveBeenCalledWith({
        where: {
          eventId: 1,
          donorId: 1,
        },
      });
    });
  });

  describe('patchEventAttendeeAmount', () => {
    it('should update the amount of an eventAttendee', async () => {
      const mockEventAttendee = { id: 1, eventId: 1, donorId: 1, amount: 100 };
      const updatedEventAttendee = { id: 1, eventId: 1, donorId: 1, amount: 200 };

      (prisma.eventAttendee.update as jest.Mock).mockResolvedValue(updatedEventAttendee);

      const params = { id: 1, amount: 200 };
      const eventAttendee = await EventAttendeeService.patchEventAttendeeAmount(params);

      expect(prisma.eventAttendee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { amount: 200 },
      });
      expect(eventAttendee).toEqual(updatedEventAttendee);
    });

    it('should throw an error if updating eventAttendee amount fails', async () => {
      (prisma.eventAttendee.update as jest.Mock).mockRejectedValue(new Error('Failed to patch eventAttendee'));

      const params = { id: 1, amount: 200 };
      await expect(EventAttendeeService.patchEventAttendeeAmount(params)).rejects.toThrow('Failed to patch eventAttendee');

      expect(prisma.eventAttendee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { amount: 200 },
      });
    });
  });

  describe('deleteEventAttendee', () => {
    it('should delete an eventAttendee by id', async () => {
      const mockEventAttendee = { id: 1, eventId: 1, donorId: 1, amount: 100 };

      (prisma.eventAttendee.delete as jest.Mock).mockResolvedValue(mockEventAttendee);

      const params = { id: 1, eventId: 1, donorId: 1 };
      const eventAttendee = await EventAttendeeService.deleteEventAttendee(params);

      expect(prisma.eventAttendee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(eventAttendee).toEqual(mockEventAttendee);
    });

    it('should throw an error if deleting eventAttendee fails', async () => {
      (prisma.eventAttendee.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete eventAttendee'));

      const params = { id: 1, eventId: 1, donorId: 1 };
      await expect(EventAttendeeService.deleteEventAttendee(params)).rejects.toThrow('Failed to delete eventAttendee');

      expect(prisma.eventAttendee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('deleteEventAttendeesByEventId', () => {
    it('should delete all eventAttendees by eventId', async () => {
      const mockEventAttendees = { count: 2 };

      (prisma.eventAttendee.deleteMany as jest.Mock).mockResolvedValue(mockEventAttendees);

      const params = { eventId: 1 };
      const result = await EventAttendeeService.deleteEventAttendeesByEventId(params);

      expect(prisma.eventAttendee.deleteMany).toHaveBeenCalledWith({
        where: { eventId: 1 },
      });
      expect(result).toEqual(mockEventAttendees);
    });

    it('should throw an error if deleting eventAttendees by eventId fails', async () => {
      (prisma.eventAttendee.deleteMany as jest.Mock).mockRejectedValue(new Error('Failed to delete eventAttendees'));

      const params = { eventId: 1 };
      await expect(EventAttendeeService.deleteEventAttendeesByEventId(params)).rejects.toThrow('Failed to delete eventAttendees');

      expect(prisma.eventAttendee.deleteMany).toHaveBeenCalledWith({
        where: { eventId: 1 },
      });
    });
  });
});
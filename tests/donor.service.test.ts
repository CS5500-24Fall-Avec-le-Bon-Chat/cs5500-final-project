import { PrismaClient } from '@prisma/client';
import { DonorService } from '../server/service/donor.service'; // Adjust the import path as needed

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    donor: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('DonorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDonorsByFundraiser', () => {
    it('should return donors by fundraiserId', async () => {
      const mockDonors = [
        { id: 1, name: 'Donor 1', fundraiserId: 1 },
        { id: 2, name: 'Donor 2', fundraiserId: 1 },
      ];

      (prisma.donor.findMany as jest.Mock).mockResolvedValue(mockDonors);

      const fundraiserId = 1;
      const donors = await DonorService.getDonorsByFundraiser({ fundraiserId });

      expect(prisma.donor.findMany).toHaveBeenCalledWith({
        where: { fundraiserId },
      });
      expect(donors).toEqual(mockDonors);
    });

    it('should throw an error if fundraiserId is not provided', async () => {
      await expect(DonorService.getDonorsByFundraiser({ fundraiserId: NaN })).rejects.toThrow('Fundraiser id is required');

      expect(prisma.donor.findMany).not.toHaveBeenCalled();
    });

    it('should throw an error if fetching donors fails', async () => {
      (prisma.donor.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get donors'));

      const fundraiserId = 1;
      await expect(DonorService.getDonorsByFundraiser({ fundraiserId })).rejects.toThrow('Failed to get donors');

      expect(prisma.donor.findMany).toHaveBeenCalledWith({
        where: { fundraiserId },
      });
    });
  });

  describe('patchDonor', () => {
    it('should update a donor by id', async () => {
      const mockDonor = { id: 1, name: 'Donor 1', fundraiserId: 1 };
      const updatedDonor = { id: 1, name: 'Updated Donor', fundraiserId: 2 };

      (prisma.donor.update as jest.Mock).mockResolvedValue(updatedDonor);

      const params = { id: 1, name: 'Updated Donor', fundraiserId: 2 };
      const donor = await DonorService.patchDonor(params);

      expect(prisma.donor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Donor', fundraiserId: 2 },
      });
      expect(donor).toEqual(updatedDonor);
    });

    it('should throw an error if donor id is not provided', async () => {
      const params = { name: 'Updated Donor', fundraiserId: 2 };

      await expect(DonorService.patchDonor(params as any)).rejects.toThrow('Donor id is required');

      expect(prisma.donor.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updating donor fails', async () => {
      (prisma.donor.update as jest.Mock).mockRejectedValue(new Error('Failed to update donor'));

      const params = { id: 1, name: 'Updated Donor', fundraiserId: 2 };
      await expect(DonorService.patchDonor(params)).rejects.toThrow('Failed to update donor');

      expect(prisma.donor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Donor', fundraiserId: 2 },
      });
    });
  });
});
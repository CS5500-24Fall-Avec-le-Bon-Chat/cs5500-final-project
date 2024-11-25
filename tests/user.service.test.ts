import { PrismaClient, Role } from '@prisma/client';
import { UserService } from '../server/service/user.service'; // Adjust the import path as needed
import bcrypt from 'bcrypt';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient), Role: { FUNDRAISER: 'FUNDRAISER', COORDINATOR: 'COORDINATOR' } };
});

jest.mock('bcrypt');

const prisma = new PrismaClient();

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        role: Role.FUNDRAISER,
        password: 'hashedpassword',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const params = {
        name: 'John Doe',
        role: Role.FUNDRAISER,
        password: 'password123',
      };

      const user = await UserService.createUser(params);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { name: 'John Doe' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          role: Role.FUNDRAISER,
          password: 'hashedpassword',
        },
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if the user already exists', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        role: Role.FUNDRAISER,
        password: 'hashedpassword',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const params = {
        name: 'John Doe',
        role: Role.FUNDRAISER,
        password: 'password123',
      };

      await expect(UserService.createUser(params)).rejects.toThrow(
        'User already exists'
      );

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { name: 'John Doe' },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw an error if required fields are missing', async () => {
      const params = {
        name: '',
        role: Role.FUNDRAISER,
        password: 'password123',
      };

      await expect(UserService.createUser(params)).rejects.toThrow(
        'Missing required fields'
      );

      expect(prisma.user.findFirst).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', role: Role.FUNDRAISER, password: 'hashedpassword' },
        { id: 2, name: 'Jane Smith', role: Role.COORDINATOR, password: 'hashedpassword' },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const users = await UserService.getUsers();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });

    it('should throw an error if fetching users fails', async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get users'));

      await expect(UserService.getUsers()).rejects.toThrow('Failed to get users');

      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'John Doe', role: Role.FUNDRAISER, password: 'hashedpassword' };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const params = { id: 1 };
      const user = await UserService.getUser(params);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(user).toEqual(mockUser);
    });

    it('should return a user by name', async () => {
      const mockUser = { id: 1, name: 'John Doe', role: Role.FUNDRAISER, password: 'hashedpassword' };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const params = { name: 'John Doe' };
      const user = await UserService.getUser(params);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { name: 'John Doe' },
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if fetching user fails', async () => {
      (prisma.user.findFirst as jest.Mock).mockRejectedValue(new Error('Failed to get user'));

      const params = { id: 1 };
      await expect(UserService.getUser(params)).rejects.toThrow('Failed to get user');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('patchUser', () => {
    it('should update the user role by id', async () => {
      const mockUser = { id: 1, name: 'John Doe', role: Role.FUNDRAISER };
      const updatedUser = { id: 1, name: 'John Doe', role: Role.COORDINATOR };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const params = { id: 1, role: Role.COORDINATOR };
      const user = await UserService.patchUser(params);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { role: Role.COORDINATOR },
      });
      expect(user).toEqual(updatedUser);
    });

    it('should update the user name by id', async () => {
      const mockUser = { id: 1, name: 'John Doe', role: Role.FUNDRAISER };
      const updatedUser = { id: 1, name: 'Jane Doe', role: Role.FUNDRAISER };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const params = { id: 1, name: 'Jane Doe' };
      const user = await UserService.patchUser(params);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Jane Doe' },
      });
      expect(user).toEqual(updatedUser);
    });

    it('should throw an error if user id is not provided', async () => {
      const params = { name: 'Jane Doe', role: Role.COORDINATOR };

      await expect(UserService.patchUser(params as any)).rejects.toThrow('User id is required');

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updating user fails', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Failed to update user'));

      const params = { id: 1, role: Role.COORDINATOR };
      await expect(UserService.patchUser(params)).rejects.toThrow('Failed to update user');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { role: Role.COORDINATOR },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user by id', async () => {
      const mockUser = { id: 1, name: 'John Doe', role: Role.FUNDRAISER };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const params = { id: 1 };
      const user = await UserService.deleteUser(params);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if the user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const params = { id: 1 };
      await expect(UserService.deleteUser(params)).rejects.toThrow('User not found');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if deleting user fails', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'John Doe', role: Role.FUNDRAISER });
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete user'));

      const params = { id: 1 };
      await expect(UserService.deleteUser(params)).rejects.toThrow('Failed to delete user');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
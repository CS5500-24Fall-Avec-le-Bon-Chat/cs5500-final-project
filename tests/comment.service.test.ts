import { PrismaClient, ReasonType } from '@prisma/client';
import { CommentService } from '../server/service/comment.service'; // Adjust the import path as needed

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient), ReasonType: { ADD: 'ADD', REMOVE: 'REMOVE', OTHER: 'OTHER' } };
});

const prisma = new PrismaClient();

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const mockComment = {
        id: 1,
        type: ReasonType.ADD,
        content: 'Test comment',
        createdAt: new Date(),
        fundraiserId: 1,
        donorId: 1,
        eventId: 1,
      };

      (prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

      const params = {
        type: ReasonType.ADD,
        content: 'Test comment',
        createdAt: new Date(),
        fundraiserId: 1,
        donorId: 1,
        eventId: 1,
      };

      const comment = await CommentService.createComment(params);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: params,
      });
      expect(comment).toEqual(mockComment);
    });

    it('should throw an error if required fields are missing', async () => {
      const params = {
        type: ReasonType.ADD,
        content: '',
        createdAt: new Date(),
        fundraiserId: 1,
        donorId: 1,
        eventId: 1,
      };

      await expect(CommentService.createComment(params)).rejects.toThrow('Missing required fields');

      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    it('should throw an error if creating comment fails', async () => {
      (prisma.comment.create as jest.Mock).mockRejectedValue(new Error('Failed to create comment'));

      const params = {
        type: ReasonType.ADD,
        content: 'Test comment',
        createdAt: new Date(),
        fundraiserId: 1,
        donorId: 1,
        eventId: 1,
      };

      await expect(CommentService.createComment(params)).rejects.toThrow('Failed to create comment');

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: params,
      });
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        { id: 1, type: ReasonType.ADD, content: 'Comment 1', createdAt: new Date(), fundraiserId: 1, donorId: 1, eventId: 1 },
        { id: 2, type: ReasonType.REMOVE, content: 'Comment 2', createdAt: new Date(), fundraiserId: 2, donorId: 2, eventId: 2 },
      ];

      (prisma.comment.findMany as jest.Mock).mockResolvedValue(mockComments);

      const comments = await CommentService.getAllComments();

      expect(prisma.comment.findMany).toHaveBeenCalled();
      expect(comments).toEqual(mockComments);
    });

    it('should throw an error if fetching comments fails', async () => {
      (prisma.comment.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get comments'));

      await expect(CommentService.getAllComments()).rejects.toThrow('Failed to get comments');

      expect(prisma.comment.findMany).toHaveBeenCalled();
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by id', async () => {
      const mockComment = { id: 1, type: ReasonType.ADD, content: 'Comment 1', createdAt: new Date(), fundraiserId: 1, donorId: 1, eventId: 1 };

      (prisma.comment.findFirst as jest.Mock).mockResolvedValue(mockComment);

      const params = { id: 1 };
      const comment = await CommentService.getCommentById(params);

      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(comment).toEqual(mockComment);
    });

    it('should throw an error if fetching comment by id fails', async () => {
      (prisma.comment.findFirst as jest.Mock).mockRejectedValue(new Error('Failed to get comment'));

      const params = { id: 1 };
      await expect(CommentService.getCommentById(params)).rejects.toThrow('Failed to get comment');

      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getCommentsByFilter', () => {
    it('should return comments by filter', async () => {
      const mockComments = [
        { id: 1, type: ReasonType.ADD, content: 'Comment 1', createdAt: new Date(), fundraiserId: 1, donorId: 1, eventId: 1 },
      ];

      (prisma.comment.findMany as jest.Mock).mockResolvedValue(mockComments);

      const filter = { fundraiserId: 1 };
      const comments = await CommentService.getCommentsByFilter(filter);

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: filter,
      });
      expect(comments).toEqual(mockComments);
    });

    it('should throw an error if fetching comments by filter fails', async () => {
      (prisma.comment.findMany as jest.Mock).mockRejectedValue(new Error('Failed to get comments'));

      const filter = { fundraiserId: 1 };
      await expect(CommentService.getCommentsByFilter(filter)).rejects.toThrow('Failed to get comments');

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: filter,
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment by id', async () => {
      const mockComment = { id: 1, type: ReasonType.ADD, content: 'Comment 1', createdAt: new Date(), fundraiserId: 1, donorId: 1, eventId: 1 };

      (prisma.comment.delete as jest.Mock).mockResolvedValue(mockComment);

      const params = { id: 1 };
      const comment = await CommentService.deleteComment(params);

      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(comment).toEqual(mockComment);
    });

    it('should throw an error if deleting comment fails', async () => {
      (prisma.comment.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete comment'));

      const params = { id: 1 };
      await expect(CommentService.deleteComment(params)).rejects.toThrow('Failed to delete comment');

      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
import { PrismaClient, ReasonType } from "@prisma/client";
import { CreateCommentParams, DeleteCommentByIdParams, GetCommentByIdParams, GetCommentsByFilterParams } from "../types/comment.types";

const prisma = new PrismaClient();

export class CommentService {

    // Create a new comment
    static async createComment(params: CreateCommentParams) {
        const { type, content, createdAt, fundraiserId, donorId, eventId } = params;
        if (!type || !content || !createdAt || !fundraiserId || !donorId) {
            throw new Error("Missing required fields");
        }

        try {
            const newComment = await prisma.comment.create({
                data: {
                    type: type,
                    content: content,
                    createdAt: createdAt,
                    fundraiserId: fundraiserId,
                    donorId: donorId,
                    eventId: eventId ?? null,
                },
            });

            return newComment;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to create comment");
        }
    }

    // Get all comments
    static async getAllComments() {
        try {
            const comments = await prisma.comment.findMany();
            return comments;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get comments");
        }
    }

    // Get a comment by id
    static async getCommentById(param: GetCommentByIdParams) {
        try {
            return await prisma.comment.findFirst({
                where: {
                    id: param.id,
                },
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get comment");
        }
    }

    // Get all comments for a fundraiser or donor or event or reason type
    static async getCommentsByFilter(filter: GetCommentsByFilterParams) {
        const { fundraiserId, donorId, eventId, type } = filter;
        const data : { fundraiserId?: number, donorId?: number, eventId?: number, type?: ReasonType } = {};
        if (fundraiserId) data.fundraiserId = fundraiserId;
        if (donorId) data.donorId = donorId;
        if (eventId) data.eventId = eventId;
        if (type) data.type = type;

        try {
            return await prisma.comment.findMany({
                where: data,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get comments");
        }
    }

    // Delete a comment by id
    static async deleteComment(param: DeleteCommentByIdParams) {
        try {
            return await prisma.comment.delete({
                where: {
                    id: param.id,
                },
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to delete comment");
        }
    }
}

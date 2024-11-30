import { ReasonType } from "@prisma/client";

export interface CreateCommentParams {
    type: ReasonType;
    content: string;
    createdAt: Date;
    fundraiserId?: number;
    donorId: number;
    eventId?: number | null;
}

export interface GetCommentByIdParams {
    id: number;
}

export interface GetCommentsByFilterParams {
    fundraiserId?: number;
    donorId?: number;
    eventId?: number;
    type?: ReasonType;
}

export interface DeleteCommentByIdParams {
    id: number;
}
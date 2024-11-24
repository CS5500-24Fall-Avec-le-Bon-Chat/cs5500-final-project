export interface CreateEventAttendeeParams {
    eventId: number;
    donorId: number;
    amount: number | 0;
}

export interface CreateManyEventAttendeeParams {
    eventAttendees: CreateEventAttendeeParams[];
}

export interface GetEventAttendeeByFilterParams {
    eventId?: number;
    donorId?: number;
}

export interface GetEventAttendeeIdParams {
    eventId: number;
    donorId: number;
}

export interface DeleteEventAttendeeParams {
    eventId: number;
    donorId: number;
}

export interface PatchEventAttendeeParams {
    id: number;
    amount: number;
}

export interface DeleteEventAttendeeParams {
    id: number;
}

export interface DeleteEventAttendeeByEventIdParams {
    eventId: number;
}
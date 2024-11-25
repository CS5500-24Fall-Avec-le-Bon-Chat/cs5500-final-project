export interface CreateEventFundraiserParams {
    eventId: number;
    fundraiserId: number;
}

export interface GetEventFundraisersFilterParams {
    eventId?: number;
    fundraiserId?: number;
}

export interface getEventFundraiserByIdParams {
    id: number;
}

export interface DeleteEventFundraiserParams {
    id : number;
}

export interface GetEventFundraiserIdParams {
    eventId: number;
    fundraiserId: number;
}
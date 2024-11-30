declare type CreateEventParam = {
    title: string;
    topic: string;
    date: string;
    city: string;
    address?: string;
    description?: string;
    goal: number;
    completed: number;
};

declare type GetDonorByFundraiserParam = {
    fundraiserId: number;
};

declare type CreateEventAttendeeParam = {
    eventId: number;
    donorId: number;
    donationAmount: number;
};

declare type FetchDonorsByEventIdParams = {
    eventId: number;
};

declare type FetchDonorsByDonorNameParams = {
    name: string;
};

declare type CheckDonorInEventParams = {
    eventId: number;
    donorId: number;
};

declare type DeleteEventAttendeeParams = {
    eventId: number;
    donorId: number;
};

declare type TasksDisplayProps = {
    eventId: number;
};

declare type DonorDisplayProps = {
    eventId: number;
};

declare type DonorProviderParams = {
    eventId: number;
    donorId?: number;
};

declare type GetTaskParams = {
    eventId: number;
};

declare type UpdateTaskStatusParam = {
    eventId: number;
    id: number;
    status: "undone" | "done";
};

declare type CreateTaskParam = {
    eventId: number;
    text: string;
    status: "undone" | "done";
};

declare type DeleteTaskParam = {
    eventId: number;
    id: number;
};

declare type AddTaskParams = {
    eventId: number;
    text: string;
    status: "undone" | "done";
};

declare type ToggleTaskStatusParams = {
    eventId: number;
    id: number;
    status: "undone" | "done";
};

declare type DeleteCurrentTaskParams = {
    eventId: number;
    id: number;
}

declare type GetDonorByFundraiserParams = {
    fundraiserId: number;
};

declare type GetFundraiserByEventParams = {
    eventId: number;
};

// declare type GenerateEventDonorsParams = {
    
//     donorId: number;
// };

declare type ToggleInvitationParams = {
    eventId: number;
    donorId: number;
};

declare type FetchCommentsByDonorParams = {
    donorId: number;
};

declare type CreateCommentParams = {
    donorId: number;
    type: ReasonType;
    fundraiserId?: number;
    content: string;
    eventId?: number;
};

declare type FetchFundraiserByDonorParams = {
    donorId: number;
};

declare type SubmitCommentParams = {
    eventId?: number;
    donorId: number;
    content: string;
    type: ReasonType;
    fundraiserId?: number;
};

declare type FilterdCommentsParams = {
    query?: string;
    type: ReasonType;
};
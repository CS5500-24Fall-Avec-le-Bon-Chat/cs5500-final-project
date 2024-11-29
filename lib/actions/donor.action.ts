export const getDonorsByFundraiser = async (param: GetDonorByFundraiserParam) => {
    try {
        const response = await fetch(`/api/donor?fundraiserId=${param.fundraiserId}`);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export const createEventAttendee = async (params: CreateEventAttendeeParam) => {
    try {
        const response = await fetch("/api/event-attendee", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export const fetchDonorsByEventId = async (params: FetchDonorsByEventIdParams) => {
    try {
        const response = await fetch(`/api/event-attendee?eventId=${params.eventId}`);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}


export const checkDonorInEvent = async (params: CheckDonorInEventParams) => {
    try {
        const response = await fetch(`/api/event-attendee?eventId=${params.eventId}&donorId=${params.donorId}`);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export const deleteEventAttendee = async (param: DeleteEventAttendeeParams) => {
    try {
        const response = await fetch("/api/event-attendee", {
            method: "DELETE",
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

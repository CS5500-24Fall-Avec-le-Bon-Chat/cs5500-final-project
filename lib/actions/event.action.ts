
export const createEvent = async (params: CreateEventParam) => {
    try {
        const response = await fetch("/api/event", {
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

export const getEvents = async () => {
    try {
        const response = await fetch("/api/event");
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export const createEventFundraiser = async (params: CreateEventFundraiserParam) => {
    try {
        const response = await fetch("/api/event-fundraiser", {
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

export const deleteEvent = async (eventId: number) => {
    try {
        const response = await fetch(`/api/event/${eventId}`, {
            method: "DELETE",
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

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

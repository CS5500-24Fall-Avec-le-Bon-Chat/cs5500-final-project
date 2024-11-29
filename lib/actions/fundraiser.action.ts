export const getFundraiserByEvent = async (params: GetFundraiserByEventParams) => {
    try {
        const response = await fetch(`/api/event-fundraiser?eventId=${params.eventId}`);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}
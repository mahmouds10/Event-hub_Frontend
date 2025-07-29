const backendDomain = "https://event-hub-backend-1ppp.vercel.app/api";

const authUrl = `${backendDomain}/auth`;
const eventsUrl = `${backendDomain}/events`;
const bookingUrl = `${backendDomain}/book`;

export const bearer = "Areeb";

export const authAPIs = {
    signup: {
        url: `${authUrl}/signup`,
        method: "POST",
    },
    login: {
        url: `${authUrl}/login`,
        method: "POST",
    },
    userDetails: {
        url: `${authUrl}/user-details`,
        method: "GET",
    },
    allUsers: {
        url: `${authUrl}/all-users`,
        method: "GET",
    },
    updateUserRole: {
        url: `${authUrl}/change-role`,
        method: "PATCH",
    },
    userData: {
        url: `${authUrl}/user-data`,
        method: "GET",
    },
};

export const eventsAPIs = {
    addEvent: {
        url: `${eventsUrl}/add-event`,
        method: "POST",
    },
    allEventsAdmin: {
        url: `${eventsUrl}/all-events`,
        method: "GET",
    },
    allEventsUser: {
        url: `${eventsUrl}/events`,
        method: "GET",
    },
    featuredEvents: {
        url: `${eventsUrl}/featured-events`,
        method: "GET",
    },
    eventDetails: {
        url: `${eventsUrl}/event-details`,
        method: "GET",
    },
    deleteEvent: {
        url: `${eventsUrl}/delete-event`,
        method: "DELETE",
    },
    updateEvent: {
        url: `${eventsUrl}/update-event`,
        method: "PATCH",
    },
};

export const bookingAPIs = {
    bookEvent: {
        url: `${bookingUrl}`,
        method: "POST",
    },
    getBookings: {
        url: `${bookingUrl}`,
        method: "GET",
    },
    deleteBooking: {
        url: `${bookingUrl}`,
        method: "DELETE",
    },
};

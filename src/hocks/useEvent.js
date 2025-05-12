import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { eventsAPIs } from "../utils/APIs.js";

const fetchEvents = async () => {
    const { data } = await axios.get(eventsAPIs.allEventsUser.url);
    const featured = data.events.filter((event) => event.isFeatured);
    const regular = data.events.filter((event) => !event.isFeatured);
    const allEvents = [...featured, ...regular];
    const sortedEvents = allEvents.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });
    return { featured, regular, sortedEvents };
};

export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
    });
};

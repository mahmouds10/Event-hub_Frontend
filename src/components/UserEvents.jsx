import React, { useState } from "react";
import { useEvents } from "../hooks/useEvent.js";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    Pagination,
    Box,
} from "@mui/material";
import UserEventCard from "./UserEventCard.jsx";

const UserEvents = () => {
    const { data, isLoading, isError } = useEvents();
    const [page, setPage] = useState(1);
    const eventsPerPage = 6; // Define how many events per page

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading events!</div>;

    // Function to handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Get events for the current page
    const currentEvents = data.regular.slice(
        (page - 1) * eventsPerPage,
        page * eventsPerPage
    );

    return (
        <Box sx={{ padding: 4 }}>
             <h2 className="text-2xl font-semibold  text-left text-gray-800 py-4">
                    Upcoming Events
                </h2>
            <Grid container spacing={4} justifyContent="center">
                {currentEvents.map((event) => (
                    <div key={event._id}>
                        <UserEventCard event={event} />
                    </div>
                ))}
            </Grid>

            <Box display="flex" justifyContent="center" marginTop={3}>
                <Pagination
                    count={Math.ceil(data.regular.length / eventsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default UserEvents;

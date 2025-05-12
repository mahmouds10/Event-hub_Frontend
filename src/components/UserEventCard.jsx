import React, { use, useContext, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Stack,
    Button,
} from "@mui/material";
import { HiOutlineCash, HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineCalendarDateRange, HiUsers } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context.jsx";
import Swal from "sweetalert2";
import { bearer, bookingAPIs } from "../utils/APIs.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BooksContext } from "../contexts/books.context.jsx";

const UserEventCard = ({ event }) => {
    const { user, token } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const { books, fetchBookings } = useContext(BooksContext);



    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const bookEvent = async (eventId) => {
        try {
            let config = {
                url: `${bookingAPIs.bookEvent.url}/${eventId}`,
                method: bookingAPIs.bookEvent.method,
                headers: {
                    token: `${bearer} ${token}`,
                },
            };
            await axios.request(config);
            queryClient.invalidateQueries(["events"]);
            toast.success("Event booked successfully");
        } catch (error) {
            console.error("Error booking event:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };

    const handleBook = async () => {
        if (!user) {
            Swal.fire({
                title: "Please login to book an event",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }
        setIsLoading(true);
        await bookEvent(event._id);
        setIsLoading(false);
        await fetchBookings();
    };

    const {
        name,
        description,
        startDate,
        eventImage,
        place,
        price,
        capacity,
        attendees,
    } = event;

    const availableSeats = capacity - attendees;

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 345,
                height: "100%",
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: 3,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.01)",
                },
                position: "relative",
            }}
        >
            {/*  */}
            {availableSeats === 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: 18,
                        left: -39,
                        backgroundColor: "#dc2626",
                        color: "white",
                        transform: "rotate(-45deg)",
                        padding: "4px 40px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        zIndex: 10,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                >
                    Complete
                </div>
            )}

            {/* Event Image */}
            <Link to={`/event/${event._id}`}>
                <CardMedia
                    component="img"
                    image={eventImage.url}
                    alt={name}
                    sx={{ objectFit: "cover", maxHeight: 200 }}
                />
            </Link>

            {/* Event Content */}
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    p: 2,
                }}
            >
                {/* Title */}
                <Link to={`/event/${event._id}`}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            textAlign: "center",
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    >
                        {name}
                    </Typography>
                </Link>

                {/* Description (truncated) */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        mt: 1,
                        mb: 2,
                        textAlign: "center",
                    }}
                >
                    {description}
                </Typography>

                {/* Details Row */}
                <Stack
                    direction="column"
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <HiOutlineLocationMarker
                            size={16}
                            className="text-gray-600"
                        />
                        <Typography variant="caption" color="text.secondary">
                            {place}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <HiOutlineCalendarDateRange
                            size={16}
                            className="text-gray-600"
                        />
                        <Typography variant="caption" color="text.secondary">
                            {new Date(startDate).toLocaleDateString()}
                        </Typography>
                    </Stack>
                    {/* Available Seats */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        mt={1}
                    >
                        <HiUsers className="text-gray-600" size={16} />
                        <Typography variant="body2" color="text.secondary">
                            {availableSeats > 0
                                ? `${availableSeats} seats available`
                                : "No seats available"}
                        </Typography>
                    </Stack>
                </Stack>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleBook}
                    disabled={
                        availableSeats === 0 ||
                        isLoading ||
                        books.some((book) => book.event._id === event._id)
                    }
                    className={availableSeats === 0 ? "booked" : ""}
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        py: 1,
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor:
                            availableSeats === 0 ||
                            books.some((book) => book.event._id === event._id)
                                ? "#ccc"
                                : undefined,
                        color:
                            availableSeats === 0 ||
                            books.some((book) => book.event._id === event._id)
                                ? "#555"
                                : "#fff",
                        "&:hover": {
                            backgroundColor:
                                availableSeats === 0 ||
                                books.some(
                                    (book) => book.event._id === event._id
                                )
                                    ? "#bbb"
                                    : undefined,
                        },
                    }}
                    aria-disabled={
                        availableSeats === 0 ||
                        isLoading ||
                        books.some((book) => book.event._id === event._id)
                    }
                >
                    {books.some((book) => book.event._id === event._id) ? (
                        "Already Booked"
                    ) : availableSeats === 0 ? (
                        "Completely Booked"
                    ) : isLoading ? (
                        <div className="flex items-center justify-between w-full">
                            <span>Booking...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <span>Book Now</span>
                            <span>{price} LE</span>
                        </div>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default UserEventCard;

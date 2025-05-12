import React, { useContext, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { eventsAPIs } from "../utils/APIs.js";
import axios from "axios";
import { HiOutlineCalendarDateRange, HiOutlineUser } from "react-icons/hi2";
import {
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineTicket,
    HiUserGroup,
} from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { format, parseISO } from "date-fns";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { BooksContext } from "../contexts/books.context.jsx";
import { UserContext } from "../contexts/user.context.jsx";

const EventPage = () => {
    const [event, setEvent] = React.useState({});
    const { id: eventId } = useParams();
    const [loading, setLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    const { books, fetchBookings } = useContext(BooksContext);
    const { user, token } = useContext(UserContext);

    const fetchEventDetails = async () => {
        try {
            let config = {
                method: eventsAPIs.eventDetails.method,
                maxBodyLength: Infinity,
                url: `${eventsAPIs.eventDetails.url}/${eventId}`,
            };

            const result = await axios.request(config);
            setEvent(result.data.event);
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    };
    useEffect(() => {
        document.title = event?.name || "Event Details";
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchEventDetails();
            setLoading(false);
        };
        fetchData();
    }, []);

    const {
        name,
        description,
        startDate,
        endDate,
        place,
        longitude,
        latitude,
        price,
        capacity,
        attendees,
        presenter,
        eventImage,
    } = event;

    const availableSeats = capacity - attendees;

    let formattedStartDate = "";
    let formattedEndDate = "";
    let formattedStartTime = "";
    let formattedEndTime = "";

    if (startDate && endDate) {
        const parsedStart = parseISO(startDate);
        const parsedEnd = parseISO(endDate);

        formattedStartDate = format(parsedStart, "yyyy-M-d");
        formattedEndDate = format(parsedEnd, "yyyy-M-d");
        formattedStartTime = format(parsedStart, "h:mm a");
        formattedEndTime = format(parsedEnd, "h:mm a");
    }

    const mapIcon = new Icon({
        iconUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

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

    return loading ? (
        <Loading />
    ) : (
        <div className="container flex flex-wrap gap-2 mx-auto lg:py-1 full-h">
            {/* Event Main Details */}
            <div className="w-full lg:w-[49%] p-4 bg-white lg:shadow-md lg:rounded-lg">
                {/* Event Name */}
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {name}
                </h1>
                {/* Event Image */}
                <img
                    src={eventImage.url}
                    alt={name}
                    className="w-full h-60 object-cover rounded-lg"
                />

                {/* Event Description */}
                <p className="text-gray-600 mt-2">{description}</p>
                {/* Event Details */}
            </div>

            {/* Event Rest Details */}
            <div className="w-full lg:w-[49%] p-4 bg-white lg:shadow-md lg:rounded-lg">
                {/* Geometric Data */}
                <div className="flex flex-col mb-4">
                    {/* Place */}
                    <div className="flex items-center gap-2 mb-1">
                        <HiOutlineLocationMarker
                            size={18}
                            className="text-gray-600"
                        />
                        <p className="text-lg font-semibold text-gray-700">
                            {place}
                        </p>
                    </div>
                    {/* Map */}
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="h-60 rounded-lg"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[latitude, longitude]} icon={mapIcon}>
                            <Popup>
                                <b>{name}</b>
                                <p>{place}</p>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* date  */}
                <div className="flex items-center gap-2 mb-1">
                    <HiOutlineCalendarDateRange
                        size={18}
                        className="text-gray-600"
                    />
                    <p className="text-md font-semibold text-gray-700">
                        {formattedStartDate} | {formattedEndDate}
                    </p>
                </div>

                {/* time  */}
                <div className="flex items-center gap-2 mb-1">
                    <HiOutlineClock size={18} className="text-gray-600" />
                    <p className="text-md font-semibold text-gray-700">
                        {formattedStartTime} | {formattedEndTime}
                    </p>
                </div>

                {/* Presenter */}
                <div className="flex items-center gap-2 mb-1">
                    <HiOutlineUser size={18} className="text-gray-600" />
                    <p className="text-md font-semibold text-gray-700">
                        {presenter}
                    </p>
                </div>

                {/* Cpaacity */}
                <div className="flex items-center gap-2 mb-1">
                    <HiUserGroup size={18} className="text-gray-600" />
                    <p className="text-md font-semibold text-gray-700">
                        {capacity} total seats
                    </p>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <HiUserGroup size={18} className="text-gray-600" />
                    <p className="text-md font-semibold text-gray-700">
                        {attendees} total attendees
                    </p>
                </div>

                {/* Available Seats */}
                <div className="flex items-center gap-2 mb-1">
                    <HiOutlineTicket size={18} className="text-gray-600" />
                    <p className="text-md font-semibold text-gray-700">
                        {availableSeats} available seats
                    </p>
                </div>

                {/* Book Now button */}
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
            </div>
        </div>
    );
};

export default EventPage;

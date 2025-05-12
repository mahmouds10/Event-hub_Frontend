import React, { useContext, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { bearer, bookingAPIs } from "../utils/APIs.js";
import { UserContext } from "../contexts/user.context.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const BookingItem = ({ booking, fetchBookings }) => {
    const [loading, setLoading] = useState(false);
    const event = booking?.event;
    const { token } = useContext(UserContext);

    const unbookEvent = async (id) => {
        try {
            let config = {
                url: `${bookingAPIs.deleteBooking.url}/${id}`,
                method: bookingAPIs.deleteBooking.method,
                headers: {
                    "Content-Type": "application/json",
                    token: `${bearer} ${token}`,
                },
            };
            await axios.request(config);
            toast.success("Event unbooked successfully");
        } catch (error) {
            console.error("Error unbooking event:", error);
            toast.error("Failed to unbook event");
        }
    };

    const onUnbook = async (id) => {
        setLoading(true);
        await unbookEvent(id);
        setLoading(false);
        await fetchBookings();
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden  my-4 relative">
            {/* Wide Image */}
            <Link to={`/event/${event?._id}`}>
                <div className="w-full overflow-hidden">
                    <img
                        src={event?.eventImage?.url}
                        alt={event?.name}
                        className="w-full h-[200px] object-cover"
                    />
                </div>
            </Link>

            {/* Event Content */}
            <div className="p-6 space-y-4">
                <div>
                    <Link to={`/event/${event?._id}`}>
                        <h2 className="text-2xl font-bold mb-1 line-clamp-1">
                            {event?.name}
                        </h2>
                    </Link>
                    <p className="text-gray-500 text-sm mb-2 uppercase">
                        {event?.type}
                    </p>

                    <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        {event?.place}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaCalendarAlt className="mr-2 text-gray-500" />
                        {new Date(event?.startDate).toLocaleDateString()} -{" "}
                        {new Date(event?.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <FaUserTie className="mr-2 text-gray-500" />
                        Presented by {event?.presenter}
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2">
                        {event?.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 border-t pt-4">
                    <p>
                        <strong>Capacity:</strong> {event?.capacity}
                    </p>
                    <p>
                        <strong>Attendees:</strong> {event?.attendees}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{event?.status}</span>
                    </p>
                    <p>
                        <strong>Featured:</strong>{" "}
                        {event?.isFeatured ? "Yes" : "No"}
                    </p>
                </div>

                {/* Booking and Unbook Button */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
                    <div className="text-center md:text-left">
                        <p className="text-xl font-semibold text-primary mb-1">
                            {event?.price} EGP
                        </p>
                        <p className="text-sm text-gray-500">
                            Booked on{" "}
                            {new Date(
                                booking?.bookingDate
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <button
                    disabled={loading}
                        onClick={() => onUnbook(booking._id)}
                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition cursor-pointer"
                    >
                        <MdCancel className="text-lg" />
                        {
                            loading ? "Unbooking..." : "Unbook Event"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingItem;

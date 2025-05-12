import React, { useRef, useState, useEffect } from "react";
import { HiOutlineLocationMarker, HiUsers } from "react-icons/hi";
import { HiOutlineCalendarDateRange, HiMiniMicrophone } from "react-icons/hi2";
import { HiCash, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const statusStyles = {
    upcoming: "bg-blue-500",
    ongoing: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
};

const AdminEventCard = ({ event, onUpdate, onDelete }) => {
    const {
        name,
        description,
        startDate,
        endDate,
        place,
        capacity,
        attendees,
        price,
        presenter,
        status,
        eventImage,
    } = event;

    const titleRef = useRef(null);
    const [isTitleTwoLines, setIsTitleTwoLines] = useState(false);

    useEffect(() => {
        if (titleRef.current) {
            const lineHeight = parseFloat(
                getComputedStyle(titleRef.current).lineHeight
            );
            const lines = titleRef.current.clientHeight / lineHeight;
            setIsTitleTwoLines(lines > 1);
        }
    }, [name]);

    // Handle delete event with sweetalert
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await onDelete(id);
                Swal.fire(
                    "Deleted!",
                    "Your event has been deleted.",
                    "success"
                );
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mx-auto my-4 w-full lg:w-[30%] flex flex-col relative">
            <img
                src={eventImage.url}
                alt={name}
                className="w-full h-48 object-cover"
            />

            <div className="p-6 flex flex-col flex-grow">
                {/* Event Name and Status */}
                <div className="mb-2">
                    <Link to={`/event/${event._id}`}>
                        <h2
                            ref={titleRef}
                            className={`text-2xl font-bold leading-tight ${
                                isTitleTwoLines
                                    ? "line-clamp-2"
                                    : "line-clamp-1"
                            }`}
                        >
                            {name}
                        </h2>
                    </Link>
                    <span
                        className={`text-white text-sm font-semibold px-3 py-1 rounded-full ${statusStyles[status]} absolute top-4 right-4`}
                    >
                        {status.toUpperCase()}
                    </span>
                </div>

                {/* Event Description */}
                <p
                    className={`text-gray-600 mb-3 ${
                        isTitleTwoLines ? "line-clamp-1" : "line-clamp-2"
                    }`}
                >
                    {description}
                </p>

                {/* Event Details */}
                <div className="text-sm space-y-2 text-gray-700 flex-grow flex flex-col justify-end">
                    <div className="flex items-center gap-2">
                        <HiOutlineCalendarDateRange
                            size={16}
                            className="text-gray-600"
                        />
                        <p>
                            {new Date(startDate).toLocaleDateString()} –{" "}
                            {new Date(endDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker
                            size={16}
                            className="text-gray-600"
                        />
                        <p>{place}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiUsers className="text-gray-600" size={16} />
                        <p>
                            <strong>Capacity:</strong> {capacity} |{" "}
                            <strong>Attendees:</strong> {attendees}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiCash className="text-gray-600" size={16} />
                        <p>{price} LE</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiMiniMicrophone className="text-gray-600" size={16} />
                        <p>{presenter}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-around gap-4 mt-6 w-full">
                    <button
                        onClick={() => onUpdate(event)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
                    >
                        <HiPencil size={18} />
                        Update
                    </button>
                    <button
                        onClick={() => handleDelete(event._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 cursor-pointer"
                    >
                        <HiTrash size={18} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminEventCard;

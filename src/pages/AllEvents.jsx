import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading.jsx";
import noEvents from "../assets/no-events.svg";
import { bearer, eventsAPIs } from "../utils/APIs.js";
import axios from "axios";
import { UserContext } from "../contexts/user.context.jsx";
import toast from "react-hot-toast";
import AdminEventCard from "../components/AdminEventCard.jsx";
import { HiPlus } from "react-icons/hi";
import AddEvent from "../components/AddEvent.jsx";
import EditEvent from "../components/EditEvent.jsx";

const statusOptions = ["all", "upcoming", "ongoing", "completed", "cancelled"];
const typeOptions = [
    "all",
    "concert",
    "workshop",
    "meetup",
    "conference",
    "other",
];

const AllEvents = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [addEvent, setAddEvent] = useState(false);
    const [editEvent, setEditEvent] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const { token } = useContext(UserContext);

    useEffect(() => {
        document.title = "All Events";
    }, []);

    const getAllevents = async () => {
        try {
            const { data } = await axios.get(eventsAPIs.allEventsAdmin.url, {
                headers: {
                    token: `${bearer} ${token}`,
                },
            });
            setEvents(data.events);
            setFilteredEvents(data.events);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            await getAllevents();
            setLoading(false);
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...events]; // Start with the current events array

            // Filter by status
            if (statusFilter !== "all") {
                filtered = filtered.filter(
                    (event) => event.status === statusFilter
                );
            }

            // Filter by type
            if (typeFilter !== "all") {
                filtered = filtered.filter(
                    (event) => event.type === typeFilter
                );
            }

            setFilteredEvents(filtered); // Update filtered events state

            // Toast message if no events match filters
            if (filtered.length === 0 && !loading) {
                toast.error("No events found for selected filters");
            }
        };

        applyFilters();
    }, [statusFilter, typeFilter, events]);

    useEffect(() => {
        document.title = "All Events";
    }, []);

    // Delete Event
    const deleteEvent = async (eventId) => {
        try {
            const { data } = await axios.delete(
                `${eventsAPIs.deleteEvent.url}/${eventId}`,
                {
                    headers: {
                        token: `${bearer} ${token}`,
                    },
                }
            );
            if (data.status === "success") {
                toast.success("Event deleted successfully");
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event._id !== eventId)
                );
            } else {
                toast.error("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Error deleting event");
        }
    };

    const closeModal = () => {
        setAddEvent(false);
        setEditEvent(false);
        setEventToEdit(null);
    };

    return loading ? (
        <Loading />
    ) : (
        <div className="py-10 px-4">
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    All Events
                </h2>
                <div className="flex gap-2 flex-wrap items-end">
                    {/* Status Filter */}
                    <div className="flex flex-col">
                        <label
                            className="text-sm font-medium text-gray-700 mb-1"
                            htmlFor="status-filter"
                        >
                            Filter by Status
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex flex-col">
                        <label
                            className="text-sm font-medium text-gray-700 mb-1"
                            htmlFor="type-filter"
                        >
                            Filter by Type
                        </label>
                        <select
                            id="type-filter"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {typeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </option>
                            ))}
                        </select>
                        {/* Add Event Button */}
                    </div>

                    {/* Add event button */}
                    <button
                        onClick={() => {
                            setAddEvent(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
                    >
                        <HiPlus className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center text-gray-500">
                    <img
                        src={noEvents}
                        alt="No events"
                        className="mx-auto w-64"
                    />
                    <p className="mt-4">No events available.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {filteredEvents.map((event) => (
                        <AdminEventCard
                            key={event._id}
                            event={event}
                            onDelete={deleteEvent}
                            onUpdate={() => {
                                setEditEvent(true);
                                setEventToEdit(event);
                            }}
                        />
                    ))}
                </div>
            )}
            {
                // Add Event Modal
                addEvent && (
                    <AddEvent closeModal={closeModal} setEvents={setEvents} />
                )
            }

            {
                // Edit Event Modal
                editEvent && (
                    <EditEvent
                        closeModal={closeModal}
                        event={eventToEdit}
                        setEvents={setEvents}
                    />
                )
            }
        </div>
    );
};

export default AllEvents;

import React, { useContext, useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import { eventsAPIs, bearer } from "../utils/APIs.js";
import { UserContext } from "../contexts/user.context.jsx";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import LocationPicker from "./LocationPicker.jsx";
import { useQueryClient } from "@tanstack/react-query";

const EditEvent = ({ event, closeModal, setEvents }) => {
    const [data, setData] = useState({
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        place: event.place,
        longitude: event.longitude,
        latitude: event.latitude,
        capacity: event.capacity,
        price: event.price,
        presenter: event.presenter,
        type: event.type,
        isFeatured: event.isFeatured,
        eventImage: event.eventImage,
        status: event.status,
    });

    const [previewImages, setPreviewImages] = useState(event.eventImage);
    const [loading, setLoading] = useState(false);

    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    const formatDateForInput = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toISOString().slice(0, 16);
    };

    const checkButtonActive = () => {
        return (
            data.name &&
            data.description &&
            data.startDate &&
            data.endDate &&
            data.place &&
            data.longitude &&
            data.latitude &&
            data.capacity &&
            data.price &&
            data.presenter &&
            data.type &&
            data.eventImage &&
            data.status &&
            new Date(data.endDate) > new Date(data.startDate)
        );
    };

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imagePreviewUrl = URL.createObjectURL(file);

        setPreviewImages(imagePreviewUrl);

        setData((prev) => ({
            ...prev,
            eventImage: file,
        }));
    };

    const removeSelectedImage = () => {
        setData((prev) => ({
            ...prev,
            eventImage: null,
        }));
        setPreviewImages(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const submitEvent = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("startDate", data.startDate);
        formData.append("endDate", data.endDate);
        formData.append("place", data.place);
        formData.append("longitude", data.longitude);
        formData.append("latitude", data.latitude);
        formData.append("capacity", data.capacity);
        formData.append("price", data.price);
        formData.append("presenter", data.presenter);
        formData.append("type", data.type);
        formData.append("isFeatured", data.isFeatured);
        formData.append("eventImage", data.eventImage);
        formData.append("status", data.status);

        try {
            let config = {
                method: eventsAPIs.updateEvent.method,
                maxBodyLength: Infinity,
                url: `${eventsAPIs.updateEvent.url}/${event?._id}`,
                headers: {
                    token: `${bearer} ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
            };

            const result = await axios(config);

            setEvents((prevEvents) =>
                prevEvents.map((ev) =>
                    ev._id === result?.data?.data.event?._id
                        ? result.data.data.event
                        : ev
                )
            );

            closeModal();
            toast.success("Event updated successfully");
        } catch (error) {
            console.log(error);
            if (error.details === "jwt expired") {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again to continue",
                }).then(() => navigate("/login"));
            } else {
                console.error("Error updating event:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 z-[51] left-0 bottom-0 right-0 bg-black/50 flex justify-center items-center">
            <div className="mx-auto mt-[64px] bg-white shadow-md rounded-md p-7 w-full relative max-w-2xl max-h-[80%] h-full overflow-y-auto">
                <button className="absolute top-3 right-5" onClick={closeModal}>
                    <IoCloseCircleOutline className="text-2xl hover:text-red-700 cursor-pointer" />
                </button>
                <h1 className="py-4 text-lg font-medium">Add New Event</h1>
                <form className="flex flex-col gap-2" onSubmit={submitEvent}>
                    {/* Event Name */}
                    <div className="grid">
                        <label htmlFor="eventName">Event name:</label>
                        <input
                            type="text"
                            id="eventName"
                            name="name"
                            value={data.name}
                            placeholder="Enter event name"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        />
                    </div>

                    {/* Description */}
                    <div className="grid">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            placeholder="Enter event description"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded resize-y max-h-[100px] min-h-[43px]"
                        />
                    </div>

                    {/* Start Date & End Date */}
                    <div className="flex">
                        <div className="grid flex-1 mr-2">
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                type="datetime-local"
                                id="startDate"
                                name="startDate"
                                value={formatDateForInput(data.startDate)}
                                onChange={handleChange}
                                className="p-2 bg-slate-100 border rounded"
                            />
                        </div>
                        <div className="grid flex-1">
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                name="endDate"
                                value={formatDateForInput(data.endDate)}
                                onChange={handleChange}
                                className="p-2 bg-slate-100 border rounded"
                            />
                        </div>
                    </div>

                    {/* Place */}
                    <div className="grid">
                        <label htmlFor="place">Place:</label>
                        <input
                            type="text"
                            id="place"
                            name="place"
                            value={data.place}
                            placeholder="Enter event place"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        />
                    </div>

                    {/* Location */}
                    <LocationPicker
                        setLatLng={(coords) =>
                            setData((prev) => ({ ...prev, ...coords }))
                        }
                        initialLocation={{
                            latitude: data.latitude,
                            longitude: data.longitude,
                        }}
                    />

                    {/* Capacity */}
                    <div className="grid">
                        <label htmlFor="capacity">Capacity:</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={data.capacity}
                            placeholder="Enter event capacity"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        />
                    </div>

                    {/* Presenter */}
                    <div className="grid">
                        <label htmlFor="presenter">Presenter:</label>
                        <input
                            type="text"
                            id="presenter"
                            name="presenter"
                            value={data.presenter}
                            placeholder="Enter event presenter"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        />
                    </div>

                    {/* Price */}
                    <div className="grid">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={data.price}
                            placeholder="Enter event price"
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        />
                    </div>

                    {/* Is Featured */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            name="isFeatured"
                            checked={data.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="isFeatured" className="text-sm">
                            Featured
                        </label>
                    </div>

                    {/* event type */}
                    <div className="grid">
                        <label htmlFor="eventType">Eevent type:</label>
                        <select
                            id="eventType"
                            name="type"
                            value={data.type}
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        >
                            {[
                                "concert",
                                "workshop",
                                "meetup",
                                "conference",
                                "other",
                            ].map((type) => {
                                return (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* event Status */}
                    <div className="grid">
                        <label htmlFor="eventStatus">Eevent status:</label>
                        <select
                            id="eventStatus"
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className="p-2 bg-slate-100 border rounded"
                        >
                            {[
                                "upcoming",
                                "ongoing",
                                "completed",
                                "cancelled",
                            ].map((status) => {
                                return (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <label className="mb-1">Upload Event Image</label>
                    <label htmlFor="uploadImageInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex flex-col justify-center items-center gap-3">
                                <FaCloudUploadAlt className="text-4xl" />
                                <p className="text-sm">Upload event image</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="uploadImageInput"
                                    onChange={handleUploadImage}
                                    multiple
                                />
                            </div>
                        </div>
                    </label>

                    <div className="flex gap-2 items-center overflow-auto mt-3">
                        {previewImages ? (
                            <div className="relative group flex items-center w-[80px] h-[80px]">
                                <div
                                    className="absolute bottom-2 right-1 p-1 text-white bg-red-600 group-hover:block rounded-full hidden"
                                    onClick={() => removeSelectedImage()}
                                >
                                    <MdDeleteOutline className="cursor-pointer" />
                                </div>
                                <img
                                    src={previewImages.url}
                                    className="bg-slate-100 border rounded w-full h-full cursor-pointer"
                                />
                            </div>
                        ) : (
                            <p className="text-red-600">*Please Upload Image</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!checkButtonActive() || loading}
                        className={`${
                            checkButtonActive()
                                ? "bg-primary hover:bg-primary-hover"
                                : "bg-slate-200"
                        } text-white w-full px-6 py-2 max-w-[150px] rounded-full transition-all mx-auto my-3 h-[40px] cursor-pointer`}
                    >
                        {loading ? (
                            <ScaleLoader
                                height={15}
                                color="#fff"
                                speedMultiplier={2}
                            />
                        ) : (
                            "Edit Event"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;

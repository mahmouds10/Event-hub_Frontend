import React, { useContext, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { HiOutlineCalendarDateRange, HiUsers } from "react-icons/hi2";
import { HiOutlineCash } from "react-icons/hi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { UserContext } from "../contexts/user.context.jsx";
import { bearer, bookingAPIs } from "../utils/APIs.js";
import axios from "axios";
import toast from "react-hot-toast";
import { BooksContext } from "../contexts/books.context.jsx";

function FeaturedCarousel({ events }) {
    const { user, token } = useContext(UserContext);
    const [loadingEvents, setLoadingEvents] = useState({});

    const { books, fetchBookings } = useContext(BooksContext);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        nextArrow: <SimpleNext />,
        prevArrow: <SimplePrev />,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    infinite: true,
                },
            },
        ],
    };

    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const bookEvent = async (event) => {
        try {
            let config = {
                url: `${bookingAPIs.bookEvent.url}/${event._id}`,
                method: bookingAPIs.bookEvent.method,
                headers: {
                    token: `${bearer} ${token}`,
                },
            };
            await axios.request(config);
            queryClient.invalidateQueries(["events"]);
            toast.success("Event booked successfully");
            navigate("/congrats", {state:{event}});
        } catch (error) {
            console.error("Error booking event:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };

    const handleBook = async (event) => {
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
        setLoadingEvents((prev) => ({ ...prev, [event?._id]: true }));
        await bookEvent(event);
        setLoadingEvents((prev) => ({ ...prev, [event?._id]: false }));
        await fetchBookings();
    };

    const slider = useRef(null);

    return (
        <div className="p-2 md:p-0">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="text-2xl font-semibold  text-left text-gray-800">
                    Featured Events
                </h2>
                <div className="flex items-center justify-end">
                    <button
                        onClick={() => {
                            slider?.current?.slickPrev();
                        }}
                        className="btn p-2 rounded-full ml-5 bg-primary w-12 h-12 text-white 
                        
                        hover:bg-primary-hover hover:text-[#fff]
                        md:bg-slate-200 md:text-primary md:hover:bg:primary-hover md:hover:text-[#fff]
                        transition-all duration-300 ease-in-out border-none flex items-center justify-center hover:cursor-pointer"
                    >
                        <FaAngleLeft style={{ fontSize: "1.25rem" }} />
                    </button>
                    <button
                        onClick={() => {
                            slider?.current?.slickNext();
                        }}
                        className="btn p-2 rounded-full ml-5 bg-primary w-12 h-12 text-white 
                        
                        hover:bg-primary-hover hover:text-[#fff]
                        md:bg-slate-200 md:text-primary md:hover:bg:primary-hover md:hover:text-[#fff]
                        transition-all duration-300 ease-in-out border-none flex items-center justify-center hover:cursor-pointer"
                    >
                        <FaAngleRight style={{ fontSize: "1.25rem" }} />
                    </button>
                </div>
            </div>

            <Slider className="mx-auto w-full" {...settings} ref={slider}>
                {events.map((event) => {
                    const availableSeats = event.capacity - event.attendees;
                    const isAvailable = availableSeats > 0;

                    return (
                        <div key={event._id} className="p-2 h-full">
                            <div className="relative flex flex-col min-h-[360px] bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[102%] duration-300">
                                {/* 🌟 Featured Ribbon */}
                                <div className="absolute top-3 left-[-40px] rotate-[-45deg] bg-yellow-500 text-white text-xs font-semibold px-10 py-1 shadow-md z-10">
                                    Featured
                                </div>

                                {/* Event Image */}
                                <Link to={`/event/${event._id}`}>
                                    <img
                                        src={event.eventImage.url}
                                        alt={event.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </Link>

                                {/* Event Details */}
                                <div className="p-4 flex-grow flex flex-col justify-between text-center">
                                    <div>
                                        <Link to={`/event/${event._id}`}>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {event.name}
                                            </h3>
                                        </Link>

                                        <div className="flex flex-col items-start ">
                                            <div className="flex items-center justify-center mt-1 gap-2 text-gray-600 text-sm">
                                                <HiOutlineLocationMarker />
                                                <span>{event.place}</span>
                                            </div>
                                            <div className="flex items-center justify-center mt-1 gap-2 text-gray-600 text-sm">
                                                <HiOutlineCalendarDateRange />
                                                <span>
                                                    {new Date(
                                                        event.startDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {/* Show seat availability */}
                                            <div className="flex items-center justify-center mt-1 gap-2 text-gray-600 text-sm">
                                                <HiUsers />
                                                <span>
                                                    {availableSeats} seats
                                                    available
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        disabled={
                                            !isAvailable ||
                                            loadingEvents[event._id] ||
                                            books.some(
                                                (book) =>
                                                    book.event._id === event._id
                                            )
                                        }
                                        onClick={() => {
                                            handleBook(event);
                                        }}
                                        className={`mt-4 w-full rounded-md py-2 px-3 text-sm font-semibold flex items-center justify-between cursor-pointer
        ${
            isAvailable && !books.some((book) => book.event._id === event._id)
                ? "bg-primary text-white hover:bg-primary-hover transition"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
                                    >
                                        {books.some(
                                            (book) =>
                                                book.event._id === event._id
                                        ) ? (
                                            <span className="mx-auto font-bold capitalize tracking-wide">
                                                Already Booked
                                            </span>
                                        ) : isAvailable ? (
                                            loadingEvents[event._id] ? (
                                                <>Booking...</>
                                            ) : (
                                                <>
                                                    <span>Book Now</span>
                                                    <span>
                                                        {event.price} LE
                                                    </span>
                                                </>
                                            )
                                        ) : (
                                            <span className="mx-auto font-bold capitalize tracking-wide">
                                                Completely Booked
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}

const SimpleNext = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "red" }}
            onClick={onClick}
        >
            Next
        </div>
    );
};
const SimplePrev = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        >
            Prev
        </div>
    );
};

export default FeaturedCarousel;

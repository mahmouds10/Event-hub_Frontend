import React, { useEffect } from "react";
import Lottie from "lottie-react";
import { useLocation, useNavigate } from "react-router-dom";
import congrats from "../assets/congrats.json";
import { format } from "date-fns";

function Congrats() {
    const location = useLocation();
    const navigate = useNavigate();
    const event = location.state?.event;

    useEffect(() => {
        console.log("Event data:", event);
    }, [event]);


    return (
        <div className="full-h bg-gradient-to-br from-blue-50 to-white px-6 md:px-14 flex flex-col lg:flex-row items-center justify-center">
            {/* Left: Animation */}
            <div className="w-full lg:w-1/2 flex justify-center items-center mb-10 lg:mb-0">
                <Lottie
                    animationData={congrats}
                    loop={false}
                    className="w-[300px] md:w-[400px]"
                />
            </div>

            {/* Right: Event Info */}
            <div className="w-full lg:w-1/2  rounded-2xl  py-2 px-6 md:px-10">
                {event.eventImage?.url && (
                    <img
                        src={event.eventImage.url}
                        alt={event.name}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                )}

                <p className="text-center text-gray-700 text-lg mb-4">
                    You've successfully registered for:
                </p>

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    {event.name}
                </h2>

                <div className="text-gray-600 space-y-2 mb-6">
                    <p>
                        <strong>📍 Location:</strong> {event.place}
                    </p>
                    <p>
                        <strong>📅 Date:</strong>{" "}
                        {format(new Date(event.startDate), "MMMM d, yyyy")} -{" "}
                        {format(new Date(event.endDate), "MMMM d, yyyy")}
                    </p>
                    <p>
                        <strong>🎤 Presenter:</strong> {event.presenter}
                    </p>
                    <p>
                        <strong>💵 Price:</strong> {event.price} EGP
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all cursor-pointer"
                    >
                        Browse More Events
                    </button>
                </div>  
            </div>
        </div>
    );
}

export default Congrats;

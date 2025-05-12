import { createContext, useContext, useEffect, useState } from "react";
import { bearer, bookingAPIs } from "../utils/APIs.js";
import { UserContext } from "./user.context.jsx";
import axios from "axios";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
    const { token } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    const [books, setBooks] = useState([]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const config = {
                url: bookingAPIs.getBookings.url,
                method: bookingAPIs.getBookings.method,
                headers: {
                    token: `${bearer} ${token}`,
                },
            };
            const response = await axios.request(config);
            setBooks(response?.data.bookings);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchBookings(); 
        }
    }, [token]); 

    return (
        <BooksContext.Provider
            value={{
                books,
                fetchBookings
            }}
        >
            {children}
        </BooksContext.Provider>
    );
};

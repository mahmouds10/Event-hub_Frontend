import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { bearer, authAPIs } from "../utils/APIs.js";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token")); // only store token
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const config = {
                method: authAPIs.userData.method,
                url: authAPIs.userData.url,
                headers: {
                    token: `${bearer} ${token}`,
                },
            };
            const response = await axios.request(config);
            return response.data.user;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return null;
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            if (!token) {
                setUser(null);
                return;
            }

            const userData = await fetchUser();
            if (userData) {
                setUser(userData);
            } else {
                // Token might be invalid, clear it
                setToken(null);
                localStorage.removeItem("token");
                setUser(null);
            }
        };

        getUserData();
    }, [token]);


    return (
        <UserContext.Provider
            value={{ token, setToken, user, setUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

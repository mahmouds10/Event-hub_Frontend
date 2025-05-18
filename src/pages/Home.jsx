import React, { useEffect, useState } from "react";
import { useEvents } from "../hooks/useEvent.js";
import {
    Box,
    Typography,
    CircularProgress,
    Pagination,
    Grid,
} from "@mui/material";
import FeaturedCarousel from "../components/FeaturedCarsoul.jsx";
import UserEvents from "../components/UserEvents.jsx";

const ITEMS_PER_PAGE = 6;

const Home = () => {


      useEffect(() => {
    document.title = "Event Hub";
  },[])

    const { data, error, isLoading } = useEvents();
    const [page, setPage] = useState(1);

    if (isLoading) return <Loading />;

    if (error) return <Typography>Error loading events</Typography>;

    const { featured } = data;


    return (
        <main className="container mx-auto  py-8  full-h">
            <div className="w-full">
                <FeaturedCarousel events={featured} />
            </div>
            <div className="w-full">
                <UserEvents />
            </div>
        </main>
    );
};

const Loading = () => {
    return (
        <>
            <div className="full-h flex items-center justify-center">
                <div className="dots-1"></div>
            </div>
        </>
    );
};

export default Home;

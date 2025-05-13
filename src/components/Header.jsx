import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context.jsx";
import logo from "../assets/event-hub-logo.svg";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import Swal from "sweetalert2";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoCart, IoTicketOutline } from "react-icons/io5";
import { BooksContext } from "../contexts/books.context.jsx";

const Header = () => {
    //State to handle sticky header
    const [sticky, setSticky] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [adminMenuVisible, setAdminMenuVisible] = useState(false);

    // Location
    const { pathname } = useLocation();

    // User Context
    const { user, setToken, setUser } = useContext(UserContext);

    const { books } = useContext(BooksContext);

    // Navigate
    const navigate = useNavigate();

    // Ref for the menu element
    const menuRef = useRef(null);
    const adminMenuRef = useRef(null);

    //Function to handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setSticky(true);
            } else if (window.scrollY < 100) {
                setSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Handle clicks outside the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false); // Close the menu
            }
        };

        if (menuVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuVisible]);

    //Handel clicks outside the admin menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                adminMenuRef.current &&
                !adminMenuRef.current.contains(event.target)
            ) {
                setAdminMenuVisible(false); // Close the menu
            }
        };

        if (adminMenuVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [adminMenuVisible]);

    // Handle logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        Swal.fire({
            icon: "success",
            title: "Sad to see you go",
            text: "You have been logged out successfully",
            confirmButtonText: "I'll be back",
        }).then(() => {
            navigate("/login");
        });
    };

    //Return the header component
    return (
        <header
            className={`h-16 fixed right-0 left-0 ${
                sticky ? "shadow-md" : ""
            } z-50 bg-white`}
        >
            <div className="h-full md:px-10 mx-auto flex items-center px-4 justify-between">
                {/* Logo Section */}
                <div className="md:w-1/4">
                    <Link className="w-[90px] block">
                        <img src={logo} alt="" />
                    </Link>
                </div>


                {/* UserIcon and cart */}
                <div className="flex items-center gap-4 lg:gap-7 md:w-1/4 justify-end">
                    {/* User Image */}
                    {user && (
                        <div
                            className="relative flex justify-center"
                            ref={menuRef}
                        >
                            <div
                                className="text-2xl cursor-pointer relative flex justify-center"
                                onClick={() => setMenuVisible((prev) => !prev)}
                            >
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={`${user.name} profile picture`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <FaRegCircleUser />
                                )}
                            </div>
                            {menuVisible && (
                                <div className="absolute bg-white bottom-0 top-11 h-fit px-2 py-3 shadow-lg rounded">
                                    <nav className="flex flex-col justify-center items-center gap-3">
                                        {user?.role === "admin" && (
                                            <div className="w-full">
                                                <Link
                                                    to={"/admin-panal"}
                                                    onClick={() =>
                                                        setMenuVisible(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    className="whitespace-nowrap hover:bg-slate-100 p-2"
                                                >
                                                    Admin Panel
                                                </Link>
                                            </div>
                                        )}
                                        <div className="w-full bg">
                                            <Link
                                                to={"/my-profile"}
                                                onClick={() =>
                                                    setMenuVisible(
                                                        (prev) => !prev
                                                    )
                                                }
                                                className="whitespace-nowrap hover:bg-slate-100 block p-2 w-full text-center "
                                            >
                                                My Profile
                                            </Link>
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Admin panal for mobiel */}
                    {user?.role == "admin" &&
                        pathname.startsWith("/admin-panal") && (
                            <div
                                className="relative flex justify-center md:hidden"
                                ref={adminMenuRef}
                            >
                                <div
                                    className="text-2xl cursor-pointer relative flex justify-center"
                                    onClick={() =>
                                        setAdminMenuVisible((prev) => !prev)
                                    }
                                >
                                    <MdOutlineAdminPanelSettings />
                                </div>
                                {adminMenuVisible && (
                                    <div className="absolute bg-white bottom-0 top-11 h-fit px-2 py-3 shadow-lg rounded">
                                        <nav className="flex flex-col justify-center items-center gap-3">
                                            {user?.role === "admin" && (
                                                <div className="w-full">
                                                    <Link
                                                        to={
                                                            "/admin-panal/all-users"
                                                        }
                                                        onClick={() =>
                                                            setAdminMenuVisible(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        className="whitespace-nowrap hover:bg-slate-100 p-2 block w-full text-center"
                                                    >
                                                        All Users
                                                    </Link>
                                                </div>
                                            )}
                                            <div className="w-full bg">
                                                <Link
                                                    to={"/admin-panal/all-events"}
                                                    onClick={() =>
                                                        setAdminMenuVisible(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    className="whitespace-nowrap hover:bg-slate-100 block p-2 w-full text-center "
                                                >
                                                    All Events
                                                </Link>
                                            </div>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        )}
                    {/* Cart */}
                    {user && (
                        <Link to={"/cart"} className="text-2xl relative">
                            <span>
                                <IoTicketOutline />
                            </span>
                            {books?.length > 0 && (
                                <div
                                    className="bg-primary text-white w-[18px] h-[18px] p-[10px] flex  
              items-center justify-center rounded-full absolute -top-2 -right-3"
                                >
                                    <span className="text-xs">
                                        {books?.length}
                                    </span>
                                </div>
                            )}
                        </Link>
                    )}

                    {/* Login Button */}
                    <div>
                        {user ? (
                            <button
                                onClick={logout}
                                className="px-3 py-1 flex cursor-pointer justify-center items-center rounded-full text-white bg-primary hover:bg-primary-hover transition-all duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to={"/login"}
                                className="px-3 py-1 flex cursor-pointer justify-center items-center rounded-full text-white bg-primary hover:bg-primary-hover transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

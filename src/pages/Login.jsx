import React, { useContext, useEffect, useRef, useState } from "react";
import loginIcon from "../assets/event-hub-noword.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authAPIs } from "./../utils/APIs";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { UserContext } from "../contexts/user.context.jsx";
import Joi from "joi";

function Login() {
    // States
    const [password, setPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validEmail, setValidEmail] = useState(null);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        document.title = "Login";
    }, []);

    // User Context
    const { setToken } = useContext(UserContext);

    // onChange Handler
    const handelChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    // onSubmit Handler
    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(data);
        setLoading(false);
    };

    const checkEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validateEmail = () => {
        const email = emailRef.current.value;
        if (email) {
            if (checkEmail(email)) {
                setValidEmail(true);
            } else {
                setValidEmail(false);
            }
        } else {
            setValidEmail(null);
        }
    };

    // Reference the inputs
    const emailRef = useRef();
    const passRef = useRef();

    // Nvigate
    const nav = useNavigate();

    const login = async (userData) => {
        try {
            // Data
            let data = JSON.stringify(userData);

            // Config
            let config = {
                method: authAPIs.login.method,
                maxBodyLength: Infinity,
                url: authAPIs.login.url,
                headers: {
                    "Content-Type": "application/json",
                },
                data: data,
            };

            const res = await axios.request(config);
            setToken(res?.data?.token);
            localStorage.setItem("token", res?.data?.token);
            Swal.fire({
                icon: "success",
                title: `Welcome back ${res?.data?.user?.name?.split(" ")[0]} !`,
                text: "You are successfully logged in",
                showConfirmButton: true,
            }).then(() => {
                setTimeout(() => {
                    nav("/");
                }, 1000);
            });
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err?.response?.data?.message,
                showConfirmButton: true,
                confirmButtonText: "Try again",
            });
        }
    };

    return (
        <section className="h-[calc(100vh-53px-64px)] flex justify-center items-center">
            <div className="mx-auto container p-4">
                <div className="bg-white p-2 w-full py-5 max-w-lg mx-auto rounded px-6">
                    {/* Logo */}
                    <div className="w-20 h-20 mx-auto my-3 flex flex-col justify-center items-center gap-2">
                        <img
                            src={loginIcon}
                            alt="login icon"
                            className="bg-blend-darken"
                        />
                        <h3 className="text-[#37364A] text-3xl font-semibold text-center">
                            EventHub
                        </h3>
                    </div>
                    {/* Form */}
                    <form
                        onSubmit={handelSubmit}
                        className="flex flex-col gap-5"
                    >
                        {/* Email Input Div */}
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="email">Email: </label>
                            <div className="bg-slate-100 ">
                                <input
                                    ref={emailRef}
                                    onChange={(e) => {
                                        handelChange(e);
                                        validateEmail();
                                    }}
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    id="email"
                                    placeholder="Enter email"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                />
                            </div>
                            {validEmail === false && (
                                <span className="text-red-600 pl-1 block">
                                    Invalid Email
                                </span>
                            )}
                        </div>

                        {/* Password Input Div */}
                        <div>
                            <label htmlFor="pass">Password: </label>
                            <div className="bg-slate-100  flex items-center">
                                <input
                                    ref={passRef}
                                    name="password"
                                    type={password ? "text" : "password"}
                                    id="pass"
                                    onChange={(e) => {
                                        handelChange(e);
                                    }}
                                    value={data.password}
                                    placeholder="Enter password"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                />
                                <div
                                    onClick={() => {
                                        setPassword((prev) => !prev);
                                    }}
                                >
                                    <span className="cursor-pointer text-lg mr-3 block">
                                        {password ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            {errors.password && data.password.length > 0 && (
                                <p className="text-red-500 text-sm">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <button
                            className={`${
                                validEmail && data.password.length > 8
                                    ? "bg-primary hover:bg-primary-hover hover:cursor-pointer"
                                    : "bg-gray-400"
                            }  text-white w-full px-6 py-2 max-w-[150px] rounded-full hover:scale-[101%]  transition-all duration-300 mx-auto my-3 flex justify-center items-center h-[40px]`}
                            type="submit"
                            disabled={
                                loading ||
                                !validEmail ||
                                data.password.length < 8
                            }
                        >
                            {loading ? (
                                <ScaleLoader
                                    height={15}
                                    color="#fff"
                                    speedMultiplier={2}
                                />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                    <p className="py-2 ">
                        Don't have an account?
                        <Link
                            className="hover:underline hover:text-primary transition-all duration-200 pl-1"
                            to={"/signup"}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;

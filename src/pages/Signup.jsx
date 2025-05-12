import React, { useEffect, useRef, useState } from "react";
import loginIcon from "../assets/profile-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { imageToBase64 } from "../utils/imageToBase64.jsx";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { authAPIs } from "./../utils/APIs";
import { HiPhoto } from "react-icons/hi2";
import { differenceInYears } from "date-fns";

function Signup() {
    // States
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [validName, setValidName] = useState(null);
    const [validEmail, setValidEmail] = useState(null);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
    });
    const [passwordValue, setPasswordValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: "",
        dateOfBirth: "",
        age: "",
        gender: "",
        profilePicture: "",
    });

    useEffect(() => {
        document.title = "Sign Up";
    }, []);

    // OnChange Handler
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
        try {
            await signUp(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Refs
    const nameRef = useRef();
    const emailRef = useRef();

    // Navigation
    const nav = useNavigate();

    // Calculate age from date of birth
    data.age = differenceInYears(new Date(), new Date(data.dateOfBirth));

    // Signup function
    const signUp = async (userData) => {
        let data = JSON.stringify(userData);

        // Axios config
        let config = {
            method: authAPIs.signup.method,
            maxBodyLength: Infinity,
            url: authAPIs.signup.url,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                confirmPassword: userData.confirmPassword,
                profilePicture: userData.profilePicture,
                dateOfBirth: userData.dateOfBirth,
                age: userData.age,
                gender:userData.gender
            },
        };

        try {
            // Await the Axios request
            await axios.request(config);
            Swal.fire({
                title: `Welcome ${userData.name} !`,
                text: `User has been created successfully`,
                icon: "success",
                confirmButtonText: "login now",
            }).then(() => {
                setTimeout(() => {
                    nav("/login");
                }, 1000);
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response.data.details,
                icon: "error",
                confirmButtonText: "Try again",
            });
        }
    };

    // Handle the file change for the profile picture
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const imagePic = await imageToBase64(file);
        setData((prev) => {
            return {
                ...prev,
                profilePic: imagePic,
                profilePicture: file,
            };
        });
    };

    const checkName = (name) => {
        const nameRegex = /^[a-zA-Z\s]*$/;
        return nameRegex.test(name);
    };

    const checkEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validateName = () => {
        const name = nameRef.current.value;
        if (name) {
            if (checkName(name)) {
                setValidName(true);
            } else {
                setValidName(false);
            }
        } else {
            setValidName(null);
        }
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

    const validatePassword = (password) => {
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const isAllValid = () => {
        return (
            validName &&
            validEmail &&
            passwordValidation.length &&
            passwordValidation.uppercase &&
            passwordValidation.lowercase &&
            passwordValidation.specialChar &&
            data.password === data.confirmPassword &&
            data.gender &&
            data.age
        );
    };

    return (
        <section className="min-h-inherit flex justify-center items-center">
            <div className="mx-auto container p-4">
                <div className="bg-white w-full py-5 max-w-lg mx-auto rounded px-6">
                    <div className="w-20 h-20 mx-auto my-3 relative  rounded-full">
                        <div className="overflow-hidden w-full h-full rounded-full">
                            <img
                                src={data.profilePic || loginIcon}
                                alt="login icon"
                                className="bg-blend-darken w-full h-full object-scale-down"
                            />
                        </div>
                        <form>
                            <label htmlFor="profilePic">
                                <div className="bg-primary p-1.5 rounded-full absolute top-12 left-14 z-10">
                                    <HiPhoto className="text-white text-xl cursor-pointer" />
                                </div>
                                <input
                                    onChange={handleFileChange}
                                    type="file"
                                    className="hidden"
                                    id="profilePic"
                                    name="profilePic"
                                    accept="image/*"
                                />
                            </label>
                        </form>
                    </div>
                    <form
                        onSubmit={(e) => {
                            handelSubmit(e);
                        }}
                        className="flex flex-col gap-5"
                    >
                        {/* Name Input */}
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="name">Name: </label>
                            <div className="bg-slate-100 ">
                                <input
                                    onChange={(e) => {
                                        handelChange(e);
                                        validateName();
                                    }}
                                    value={data.name}
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Enter name"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                    ref={nameRef}
                                />
                            </div>
                            {validName === false && (
                                <span className="text-red-600 pl-1 block">
                                    Invalid Name
                                </span>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="email">Email: </label>
                            <div className="bg-slate-100 ">
                                <input
                                    onChange={(e) => {
                                        handelChange(e);
                                        validateEmail();
                                    }}
                                    value={data.email}
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="Enter email"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                    ref={emailRef}
                                />
                            </div>
                            {validEmail === false && (
                                <span className="text-red-600 pl-1 block">
                                    Invalid Email
                                </span>
                            )}
                        </div>

                        {/* Age Input */}
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="dateOfBirth">Date Of Birth: </label>
                            <div className="bg-slate-100 ">
                                <input
                                    onChange={(e) => {
                                        handelChange(e);
                                    }}
                                    value={data.dateOfBirth}
                                    name="dateOfBirth"
                                    type="date"
                                    id="dateOfBirth"
                                    placeholder="select date"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                />
                            </div>
                            {data.dateOfBirth && data.age < 18 && (
                                <span className="text-red-600 pl-1 block">
                                    Min age is 18
                                </span>
                            )}
                        </div>

                        {/* Gender Input */}
                        <div className="flex flex-col gap-y-1">
                            <label>Gender:</label>
                            <div className="flex gap-x-4 bg-slate-100 p-2 rounded">
                                <label className="flex items-center gap-x-1">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={data.gender === "male"}
                                        onChange={handelChange}
                                    />
                                    Male
                                </label>
                                <label className="flex items-center gap-x-1">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={data.gender === "female"}
                                        onChange={handelChange}
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password">Password: </label>
                            <div className="bg-slate-100 flex items-center">
                                <input
                                    onChange={(e) => {
                                        handelChange(e);
                                        validatePassword(e.target.value);
                                        setPasswordValue(e.target.value);
                                    }}
                                    value={data.password}
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter password"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                />
                                <div
                                    onClick={() =>
                                        setPasswordVisible((prev) => !prev)
                                    }
                                >
                                    <span className="cursor-pointer text-lg mr-3 block">
                                        {passwordVisible ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <ul
                                className={`text-red-600 pl-1 ${
                                    passwordValue ? "block" : "hidden"
                                }`}
                            >
                                <li
                                    className={
                                        passwordValidation.length
                                            ? "text-green-600"
                                            : ""
                                    }
                                >
                                    {passwordValidation.length
                                        ? "✔ Atleast 8 characters"
                                        : "✖ Atleast 8 characters"}
                                </li>
                                <li
                                    className={
                                        passwordValidation.uppercase
                                            ? "text-green-600"
                                            : ""
                                    }
                                >
                                    {passwordValidation.uppercase
                                        ? "✔ At least 1 uppercase"
                                        : "✖ At least 1 uppercase"}
                                </li>
                                <li
                                    className={
                                        passwordValidation.lowercase
                                            ? "text-green-600"
                                            : ""
                                    }
                                >
                                    {passwordValidation.lowercase
                                        ? "✔ At least 1 lowercase"
                                        : "✖ At least 1 lowercase"}
                                </li>
                                <li
                                    className={
                                        passwordValidation.specialChar
                                            ? "text-green-600"
                                            : ""
                                    }
                                >
                                    {passwordValidation.specialChar
                                        ? "✔ At least 1 special character"
                                        : "✖ At least 1 special character"}
                                </li>
                            </ul>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword">
                                Confirm Password:{" "}
                            </label>
                            <div className="bg-slate-100 flex items-center">
                                <input
                                    onChange={(e) => {
                                        handelChange(e);
                                        if (e.target.value === "") {
                                            setPasswordValidation((prev) => ({
                                                ...prev,
                                                confirm: false,
                                            }));
                                        } else if (
                                            e.target.value === data.password
                                        ) {
                                            setPasswordValidation((prev) => ({
                                                ...prev,
                                                confirm: true,
                                            }));
                                        } else {
                                            setPasswordValidation((prev) => ({
                                                ...prev,
                                                confirm: false,
                                            }));
                                        }
                                    }}
                                    value={data.confirmPassword}
                                    name="confirmPassword"
                                    type={
                                        confirmPasswordVisible
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    className="w-full h-full outline-none bg-transparent p-2"
                                />
                                <div
                                    onClick={() =>
                                        setConfirmPasswordVisible(
                                            (prev) => !prev
                                        )
                                    }
                                >
                                    <span className="cursor-pointer text-lg mr-3 block">
                                        {confirmPasswordVisible ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>
                            </div>
                            {data.confirmPassword &&
                                data.password !== data.confirmPassword && (
                                    <span className="text-red-600 pl-1 block">
                                        Passwords do not match
                                    </span>
                                )}
                        </div>

                        {/* Signup button */}
                        <button
                            className={`${
                                isAllValid()
                                    ? "bg-primary hover:bg-primary-hover"
                                    : "bg-slate-200"
                            } text-white w-full px-6 py-2 max-w-[150px] rounded-full transition-all duration-300 flex justify-center items-center mx-auto my-3 h-[40px] `}
                            type="submit"
                            // disabled={!isAllValid() || loading}
                        >
                            {loading ? (
                                <ScaleLoader
                                    height={15}
                                    color="#fff"
                                    speedMultiplier={2}
                                />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    {/* Already have an account */}
                    <p className="py-2">
                        Already have an account?
                        <Link
                            className="hover:underline hover:text-primary transition-all duration-200 pl-2"
                            to={"/login"}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Signup;

import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from "axios";
import { UserContext } from "../contexts/user.context.jsx";
import { authAPIs, bearer } from "../utils/APIs.js";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";

function ChangeRole({
    id,
    name,
    email,
    currentRole,
    profilePicture,
    closeModal,
    onRoleChange,
    setModal,
}) {
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);
    const [currentRoleState, setCurrentRoleState] = useState(currentRole);

    const { token: userToken } = useContext(UserContext);

    const navigate = useNavigate();

    const handelSelectChange = (e) => {
        setRole(e.target.value);
    };

    const changeUserRole = async () => {
        setLoading(true);
        try {
            let data = JSON.stringify({
                role: role,
            });

            let config = {
                method: authAPIs.updateUserRole.method,
                maxBodyLength: Infinity,
                url: `${authAPIs.updateUserRole.url}/${id}`,
                headers: {
                    token: `${bearer} ${userToken}`,
                    "Content-Type": "application/json",
                },
                data: data,
            };

            const res = await axios.request(config);
            setCurrentRoleState(res?.data?.data?.newRole);
            setRole(res?.data?.data?.newRole);
            setModal(false);
            Swal.fire({
                icon: "success",
                title: res.data.message,
                text: `User role changed from ${res.data.data.oldRole} to ${res.data.data.newRole}`,
            });
            onRoleChange(id, res.data.data.newRole);
        } catch (err) {
            if (err?.response?.data?.error?.details == "jwt expired") {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again to continue",
                    confirmButtonText: "Login",
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.response?.data?.message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed z-[51] top-0 left-0 bottom-0 right-0 bg-black/50 flex justify-center items-center">
            <div className="mx-auto mt-[64px] bg-white shadow-md rounded-md p-7 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-5 "
                    onClick={closeModal}
                >
                    <IoCloseCircleOutline className="text-2xl hover:text-primary-hover cursor-pointer hover:scale-105 transition-all duration-300 ease-in-oute" />
                </button>
                <h1 className="py-4 text-lg font-medium">Change user role</h1>
                <div className="my-6">
                    {profilePicture ? (
                        <img
                            src={profilePicture?.url}
                            className="w-32 h-3w-32 rounded-full mx-auto"
                            alt=""
                        />
                    ) : (
                        <FaRegCircleUser className="text-7xl rounded-full mx-auto" />
                    )}
                </div>
                <p className="my-4 ">
                    Name: <span className="pl-3">{name}</span>
                </p>
                <p className="my-4 ">
                    Email: <span className="pl-3">{email}</span>
                </p>
                <p className="my-4 ">
                    Current role:{" "}
                    <span className="pl-3">{currentRoleState}</span>
                </p>
                <div className="flex justify-center items-center gap-4 my-5 ">
                    <p className="">Role</p>
                    <select
                        className="flex-grow borderrounded-lg focus:outline-none border border-gray-400 p-2 transition duration-300"
                        value={role}
                        onChange={handelSelectChange}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button
                    className="bg-primary hover:primary-hover text-white w-full px-5 py-2 max-w-[150px] rounded-full hover:scale-[101%] transition-all duration-300 mx-auto my-3 flex justify-center items-center h-[40px] cursor-pointer ease-in-out"
                    onClick={changeUserRole}
                    disabled={loading}
                >
                    {loading ? (
                        <ScaleLoader
                            height={15}
                            color="#fff"
                            speedMultiplier={2}
                        />
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChangeRole;

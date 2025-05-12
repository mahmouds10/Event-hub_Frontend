import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/user.context.jsx";
import { authAPIs, bearer } from "./../utils/APIs";
import { format } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import ChangeRole from "../components/ChangeRole.jsx";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        document.title = "All Users";
    }, []);

    const navigate = useNavigate();

    // Get the current user
    const { token } = useContext(UserContext);

    // Get all users
    const getAllUsers = async () => {
        try {
            let config = {
                method: authAPIs.allUsers.method,
                maxBodyLength: Infinity,
                url: authAPIs.allUsers.url,
                headers: {
                    token: `${bearer} ${token}`,
                },
            };
            const result = await axios.request(config);
            setUsers(result?.data?.users);
        } catch (err) {
            console.log(err);
            if (err?.response?.data?.details == "jwt expired") {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again to continue",
                    confirmButtonText: "Login",
                }).then(() => {
                    navigate("/login");
                });
            }
        }
    };

    // Update user's role in the local state
    const updateUserRole = (userId, newRole) => {
        const updatedUsers = users?.map((user) => {
            if (user._id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllUsers();
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="">
                    <table className="w-full userTable">
                        <thead>
                            <tr>
                                <th className="hidden md:table-cell">Sr.</th>
                                <th className="hidden md:table-cell">Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="hidden md:table-cell">
                                    Created At
                                </th>
                                <th> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => {
                                return (
                                    <tr key={user._id}>
                                        <td className="hidden md:table-cell">
                                            {index + 1}
                                        </td>
                                        <td className="hidden md:table-cell">
                                            {user.name}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td className="hidden md:table-cell">
                                            {format(
                                                new Date(user.createdAt),
                                                "yyyy-MM-dd hh:mm"
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={async () => {
                                                    setSelectedUser(user);
                                                    setModal(true);
                                                }}
                                                className="bg-green-200 rounded-full p-[7px] hover:bg-green-600
                         hover:text-white transition-all duration-300 cursor-pointer"
                                            >
                                                <MdModeEdit />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {modal && selectedUser && (
                        <ChangeRole
                            id={selectedUser._id}
                            name={selectedUser.name}
                            email={selectedUser.email}
                            currentRole={selectedUser.role}
                            profilePic={selectedUser.profilePic}
                            setModal={setModal}
                            closeModal={() => {
                                setModal(false);
                                setSelectedUser(null);
                            }}
                            onRoleChange={updateUserRole}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default AllUsers;

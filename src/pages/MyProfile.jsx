import React, { useContext, useEffect } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { UserContext } from "../contexts/user.context.jsx";

const MyProfile = () => {
    const { user } = useContext(UserContext);
  useEffect(() => {
    document.title = "Profile";
  },[])
    return (
        <div className="full-h bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8">
                <div className="flex flex-col items-center">
                    {user?.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt="Profile Pic"
                            className="rounded-full h-32 w-32 object-cover shadow-md"
                        />
                    ) : (
                        <FaRegCircleUser className="text-[8rem] text-gray-300" />
                    )}

                    <h1 className="text-2xl font-semibold text-gray-800 mt-4">
                        {user?.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

                    <div className="w-full mt-6 space-y-3 text-gray-700">
                        <ProfileItem label="Role" value={user?.role} />
                        <ProfileItem label="Age" value={user?.age} />
                        <ProfileItem label="Gender" value={user?.gender} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ label, value }) => (
    <div className="flex justify-between border-b pb-2 text-sm">
        <span className="font-medium">{label}</span>
        <span>{value || "—"}</span>
    </div>
);

export default MyProfile;

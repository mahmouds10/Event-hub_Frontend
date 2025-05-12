import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context.jsx";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { PiUsersThreeLight } from "react-icons/pi";
import PanalItem from "./../components/PanalItem.jsx";
import { PiTableLight } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";

function AdminPanal() {
  // User Context
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.title = "Admin Panal";
  },[])

  return (
    <div className="min-h-inherit flex  ">
      {/* Aside */}
      <aside className="min-h-full  bg-white max-w-60 w-full hidden md:block custom-shadow">
        {/* Aside Header */}
        <div className="fixed w-60">
          <div className="h-32 flex flex-col justify-center items-center my-2">
            <div className="text-4xl cursor-pointer relative flex justify-center">
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture?.url}
                  alt={`${user?.name} profile picture`}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <FaRegCircleUser />
              )}
            </div>
            <p className="capitalize text-lg font-semibold">{user?.name}</p>
            <p className="text-md">{user?.role}</p>
          </div>
          {/* Navigate */}
          <div className="m-4 ">
            <nav className="flex flex-col gap-1">
              <PanalItem
                href={"all-users"}
                icon={<PiUsersThreeLight />}
                text="All Users"
              />
              <PanalItem
                href={"all-events"}
                icon={<PiTableLight />}
                text="events"
              />
            </nav>
          </div>
        </div>
      </aside>
      {/* Main */}
      <main className="w-full min-h-full ">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPanal;

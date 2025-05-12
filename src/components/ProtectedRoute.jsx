import React from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/user.context.jsx";
import NotAuthorized from "../pages/NotAuthorized.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);
  if (!user || !allowedRoles.includes(user.role)) {
    return <NotAuthorized />;
  } else {
    return children;
  }
}

export default ProtectedRoute;

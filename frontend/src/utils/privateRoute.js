import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <div className="text-center p-8 text-indigo-600">Loading user data...</div>;
    }

    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <Outlet />;
}

export default PrivateRoute;
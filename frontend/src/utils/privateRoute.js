import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getUserData } from "../api";

const PrivateRoute = ({ allowedRoles }) => {
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        const fetchUserRole = async () => {
            try {
                const userData = await getUserData(token); 
                setUserRole(userData.groups);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to fetch user data", e)
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserRole();
        
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }
      
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (userRole && allowedRoles.includes(userRole)) {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace />;
    }
}

export default PrivateRoute;
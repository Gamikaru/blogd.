// PrivateRoute.jsx
// Desc: PrivateRoute component to protect routes and redirect unauthenticated users
import { Logger, Spinner, useUser } from '@components';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute: A component wrapper to protect routes and redirect unauthenticated users.
 */
const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['PassBloggs']);
    const token = cookies.PassBloggs; // Get the token from cookies
    const { user, loading } = useUser() || {}; // Add fallback empty object in case of null

    // If data is still loading, show the spinner
    if (loading) {
        Logger.info('PrivateRoute: Loading user data...');
        return <Spinner />;
    }

    // If no token or user is found, redirect to login
    if (!token || !user) {
        Logger.info('User not authenticated. Redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    // If user is authenticated, render the children (protected content)
    return children;
};

export default PrivateRoute;
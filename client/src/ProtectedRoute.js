import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/' }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;

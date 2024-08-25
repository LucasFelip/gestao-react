import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não houver token, redireciona para o login
        return <Navigate to="/login" replace />;
    }

    return children; // Se houver token, renderiza o componente protegido
};

export default ProtectedRoute;
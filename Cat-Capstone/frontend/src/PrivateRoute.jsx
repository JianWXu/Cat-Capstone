// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');

  if (userToken) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PrivateRoute;

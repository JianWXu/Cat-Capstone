import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './UserContextTEMP';

function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;

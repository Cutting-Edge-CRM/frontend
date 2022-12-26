import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase.js';


const GuardedRoute = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

export default GuardedRoute;
import React, {useEffect} from 'react';
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase.js';


const GuardedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
      return;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

export default GuardedRoute;
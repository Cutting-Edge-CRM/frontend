import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import { isClient } from './FeatureGuards';

const GuardedRoute: React.FunctionComponent<any> = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
      return;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (isClient()) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

export default GuardedRoute;
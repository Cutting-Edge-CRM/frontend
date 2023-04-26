import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import { isAllowed } from './FeatureGuards';

const GuardedRouteUser: React.FunctionComponent<any> = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
      return;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!isAllowed(children.props.permission)) {
      return <Navigate to="/schedule" replace />;
    }
    
    return children;
  };

export default GuardedRouteUser;
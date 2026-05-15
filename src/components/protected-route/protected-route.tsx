import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { selectIsAuthInit } from '../../services/user/user-slice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthInit = useSelector(selectIsAuthInit);
  const location = useLocation();

  if (onlyUnAuth && isAuthInit) {
    const from = (location.state?.from as Location) || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !isAuthInit) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

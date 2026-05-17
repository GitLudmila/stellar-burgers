import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import {
  selectIsAuthInit,
  selectIsCheckingSession
} from '../../services/user/user-slice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthInit = useSelector(selectIsAuthInit);
  const isCheckingSession = useSelector(selectIsCheckingSession);
  const location = useLocation();

  if (isCheckingSession) {
    return <Preloader />;
  }

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

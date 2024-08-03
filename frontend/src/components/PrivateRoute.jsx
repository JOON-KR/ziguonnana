import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Route {...rest} element={isLoggedIn ? <Element /> : <Navigate to="/" />} />
  );
};

export default PrivateRoute;

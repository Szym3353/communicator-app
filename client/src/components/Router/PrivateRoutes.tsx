import React from "react";
import Cookie from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import store, { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { getUser } from "../../store/user";
import jwtDecode from "jwt-decode";

const PrivateRoutes = () => {
  let dispatch = useDispatch<AppDispatch>();
  let token = Cookie.get("token");

  React.useEffect(() => {
    if (token && !store.getState().user.data) {
      let decoded: { id: string; email: string } = jwtDecode(token);
      dispatch(getUser(decoded.id));
    }
  }, [token, dispatch]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

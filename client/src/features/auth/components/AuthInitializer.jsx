import { useEffect } from "react";
import { useDispatch } from "react-redux";

import GlobalLoader from "@/components/feedback/loading/GlobalLoader";

import { useGetMeQuery } from "../authApi";
import { clearCredentials,setCredentials } from "../authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setCredentials(data.data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearCredentials());
    }
  }, [isError, dispatch]);

  if (isLoading) {
    return <GlobalLoader />;
  }

  return children;
};

export default AuthInitializer;

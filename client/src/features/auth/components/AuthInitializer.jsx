import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useGetMeQuery } from "../authApi";
import { setCredentials, clearCredentials } from "../authSlice";
import GlobalLoader from "@/components/feedback/loading/GlobalLoader";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const { data, error, isLoading, isError, isSuccess } = useGetMeQuery();

  console.log({
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  });

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

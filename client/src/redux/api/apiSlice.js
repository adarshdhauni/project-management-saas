import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/api/v1/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (!refreshResult.error) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Workspace",
    "Project",
    "Task",
    "Comment",
    "Activity",
    "Notification",
  ],

  endpoints: () => ({}),
});

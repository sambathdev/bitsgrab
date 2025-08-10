import type { ErrorMessage } from "@/lib/utils";
import { deepSearchAndParseDates } from "@/lib/utils";
import _axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { redirect } from "react-router";

import { USER_KEY } from "../constants/query-keys";
import { translateError } from "../services/errors/translate-error";
import { queryClient } from "./query-client";
import { toast } from "sonner";

export const axios = _axios.create({ baseURL: "/api", withCredentials: true });

// Intercept responses to transform ISO dates to JS date objects
axios.interceptors.response.use(
  (response) => {
    const transformedResponse = deepSearchAndParseDates(response.data, [
      "createdAt",
      "updatedAt",
    ]);
    return { ...response, data: transformedResponse };
  },
  (error) => {
    // incase handle with backend, conditional with status code, if 500 defaultto something wetnt wrong. and 404 to not found, .....
    const message = error.response?.data.message as ErrorMessage;
    const description = translateError(message);
    if (description) {
      toast.error("Oops, the server returned an error.", {
        description,
      });
    }else{
      toast.error("Oops, the server returned an error.");
    }


    return Promise.reject(new Error(message));
  }
);

// Create another instance to handle failed refresh tokens
// Reference: https://github.com/Flyrell/axios-auth-refresh/issues/191
const axiosForRefresh = _axios.create({
  baseURL: "/api",
  withCredentials: true,
});

 const refreshToken = async (_axios: AxiosInstance) => {
  return false;
};

// Interceptor to handle expired access token errors
const handleAuthError = () => refreshToken(axiosForRefresh);

// Interceptor to handle expired refresh token errors
const handleRefreshError = async () => {
  await queryClient.invalidateQueries({ queryKey: USER_KEY });
  redirect("/auth/login");
};

// Intercept responses to check for 401 and 403 errors, refresh token and retry the request
createAuthRefreshInterceptor(axios, handleAuthError, {
  statusCodes: [401, 403],
});
createAuthRefreshInterceptor(axiosForRefresh, handleRefreshError);

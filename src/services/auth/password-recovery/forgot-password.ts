import type { ForgotPasswordDto } from "@/lib/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/lib/axios";

export const forgotPassword = async (data: ForgotPasswordDto) => {
  return axios.post<undefined, AxiosResponse<undefined>, ForgotPasswordDto>(
    "/auth/forgot-password",
    data,
  );
};

export const useForgotPassword = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: forgotPasswordFn,
  } = useMutation({
    mutationFn: forgotPassword,
  });

  return { forgotPassword: forgotPasswordFn, loading, error };
};

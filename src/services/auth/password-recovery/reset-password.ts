import type { ResetPasswordDto } from "@/lib/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/lib/axios";

export const resetPassword = async (data: ResetPasswordDto) => {
  return axios.post<undefined, AxiosResponse<undefined>, ResetPasswordDto>(
    "/auth/reset-password",
    data,
  );
};

export const useResetPassword = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: resetPasswordFn,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return { resetPassword: resetPasswordFn, loading, error };
};

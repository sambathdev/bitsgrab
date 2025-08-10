import type { AuthResponseDto, RegisterDto } from "@/lib/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth";

export const register = async (data: RegisterDto) => {
  const response = await axios.post<AuthResponseDto, AxiosResponse<AuthResponseDto>, RegisterDto>(
    "/auth/register",
    data,
  );

  return response.data;
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: registerFn,
  } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  return { register: registerFn, loading, error };
};

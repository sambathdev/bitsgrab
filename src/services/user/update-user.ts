import type { UpdateUserDto, UserDto } from "@/lib/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

export const updateUser = async (data: UpdateUserDto) => {
  const response = await axios.patch<UserDto, AxiosResponse<UserDto>, UpdateUserDto>(
    "/user/me",
    data,
  );

  return response.data;
};

export const useUpdateUser = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateUserFn,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  return { updateUser: updateUserFn, loading, error };
};

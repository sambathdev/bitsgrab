import type { MessageDto } from "@/lib/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

export const deleteUser = async () => {
  const response = await axios.delete<MessageDto, AxiosResponse<MessageDto>>("/user/me");

  return response.data;
};

export const useDeleteUser = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteUserFn,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return { deleteUser: deleteUserFn, loading, error };
};

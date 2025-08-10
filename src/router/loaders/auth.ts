import type { UserDto } from "@/lib/dto";
import { authResponseSchema } from "@/lib/dto";
import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";

import { USER_KEY } from "@/constants/query-keys";
import { queryClient } from "@/lib/query-client";
import { fetchUser } from "@/services/user";
import { useAuthStore } from "@/stores/auth";

export const authLoader: LoaderFunction<UserDto> = async ({ request }) => {
  const status = new URL(request.url).searchParams.get("status");

  const { success } = authResponseSchema.pick({ status: true }).safeParse({ status });

  if (!success) return redirect("/auth/login");

  if (status === "2fa_required") {
    return redirect("/auth/verify-otp");
  }

  const user = await queryClient.fetchQuery({
    queryKey: [USER_KEY],
    queryFn: fetchUser,
  });

  if (!user) {
    return redirect("/auth/login");
  }

  if (status === "authenticated") {
    useAuthStore.setState({ user });

    return redirect("/dashboard");
  }
};

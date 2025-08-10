import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router";

import { Providers } from "../providers";
import { AuthGuard } from "./guards/auth";
import { GuestGuard } from "./guards/guest";
import { authLoader } from "./loaders/auth";

export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
    <Route errorElement={<div />}>
      <Route element={<div />}>
        <Route path="/" element={<div />} />
      </Route>

      <Route path="auth">
        <Route element={<div />}>
          <Route element={<GuestGuard />}>
            <Route path="login" element={<div />} />
            <Route path="register" element={<div />} />
          </Route>

          {/* Password Recovery */}
          <Route element={<GuestGuard />}>
            <Route path="forgot-password" element={<div />} />
            <Route path="reset-password" element={<div />} />
          </Route>

          {/* Email Verification */}
          <Route element={<AuthGuard />}>
            <Route path="verify-email" element={<div />} />
          </Route>

          {/* OAuth Callback */}
          <Route path="callback" loader={authLoader} element={<div />} />
        </Route>

        <Route index element={<Navigate replace to="/auth/login" />} />
      </Route>

      <Route path="dashboard">
        <Route element={<AuthGuard />}>
          <Route element={<div />}>
            <Route path="resumes" element={<div />} />
            <Route path="settings" element={<div />} />

            <Route index element={<Navigate replace to="/dashboard/resumes" />} />
          </Route>
        </Route>
      </Route>


      {/* <Route path=":username">
        <Route path=":slug" loader={publicLoader} element={<PublicResumePage />} />
      </Route> */}
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);

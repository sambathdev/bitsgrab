import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { Providers } from "../providers";

import { AuthGuard } from "./guards/auth";
import { GuestGuard } from "./guards/guest";
import { authLoader } from "./loaders/auth";

import MainLayout from "@/layout/main-layout";
import Home from "@/pages/home-dashboard";
import Settings from "@/pages/app-settings/page";
import ChildLayout from "@/layout/child-layout";
import ClipboardApp from "@/pages/child/clipboard-app/page";
import TiktokDownloader from "@/pages/video-downloader/tiktok-downloader";
import YoutubeDownloader from "@/pages/video-downloader/youtube-downloader";
import UrlStreamableDownloader from "@/pages/video-downloader/url-streamable-downloader";
import Encryption from "@/pages/encryption/page";
import FrameCapture from "@/pages/frame-capture/page";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Providers />}>
          <Route path="main" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="video-downloader/youtube"
              element={<YoutubeDownloader />}
            />
            <Route
              path="video-downloader/tiktok"
              element={<TiktokDownloader />}
            />
            <Route
              path="video-downloader/url-streamable"
              element={<UrlStreamableDownloader />}
            />
            <Route path="settings" element={<Settings />} />
            <Route path="encryption" element={<Encryption />} />
            <Route path="frame-capture" element={<FrameCapture />} />
          </Route>
          <Route path="child" element={<ChildLayout />}>
            <Route path="clipboard" element={<ClipboardApp />} />
          </Route>
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

              <Route
                index
                element={<Navigate replace to="/dashboard/resumes" />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

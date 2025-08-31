import * as React from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeSwitch } from "@/components/theme-switch";
import { Link } from "react-router-dom";
import { handleClickDisableNewTab } from "@/lib/utils";
import { useDownloaderStore, useSavePathStore } from "@/stores";
import { useLayoutSize } from "@/hooks";

// const teams = [
//   {
//     name: "Acme Inc",
//     logo: GalleryVerticalEnd,
//     plan: "Enterprise",
//   },
//   {
//     name: "Acme Corp.",
//     logo: AudioWaveform,
//     plan: "Startup",
//   },
//   {
//     name: "Evil Corp.",
//     logo: Command,
//     plan: "Free",
//   },
// ];
const navMain = [
  {
    title: "Home",
    url: "/main",
    icon: Settings2,
  },
  {
    title: "Video Downloader",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Tiktok",
        url: "/main/video-downloader/tiktok",
      },
      {
        title: "Youtube",
        url: "/main/video-downloader/youtube",
      },
      {
        title: "Url Streamable",
        url: "/main/video-downloader/url-streamable",
      },
    ],
  },
  // {
  //   title: "Models",
  //   url: "#",
  //   icon: Bot,
  //   items: [
  //     {
  //       title: "Genesis",
  //       url: "#",
  //     },
  //     {
  //       title: "Explorer",
  //       url: "#",
  //     },
  //     {
  //       title: "Quantum",
  //       url: "#",
  //     },
  //   ],
  // },
  // {
  //   title: "Documentation",
  //   url: "#",
  //   icon: BookOpen,
  //   items: [
  //     {
  //       title: "Introduction",
  //       url: "#",
  //     },
  //     {
  //       title: "Get Started",
  //       url: "#",
  //     },
  //     {
  //       title: "Tutorials",
  //       url: "#",
  //     },
  //     {
  //       title: "Changelog",
  //       url: "#",
  //     },
  //   ],
  // },
  {
    title: "Settings",
    url: "/main/settings",
    icon: Settings2,
    // items: [
    //   {
    //     title: "General",
    //     url: "#",
    //   },
    //   {
    //     title: "Team",
    //     url: "#",
    //   },
    //   {
    //     title: "Billing",
    //     url: "#",
    //   },
    //   {
    //     title: "Limits",
    //     url: "#",
    //   },
    // ],
  },
  {
    title: "Encryption",
    url: "/main/encryption",
    icon: Settings2,
  },
  {
    title: "Frame Capture",
    url: "/main/frame-capture",
    icon: Settings2,
  },
];

// const user = {
//   name: "shadcn",
//   email: "m@example.com",
//   avatar: "/avatars/shadcn.jpg",
// };

// const projects = [
//   {
//     name: "Design Engineering",
//     url: "#",
//     icon: Frame,
//   },
//   {
//     name: "Sales & Marketing",
//     url: "#",
//     icon: PieChart,
//   },
//   {
//     name: "Travel",
//     url: "#",
//     icon: Map,
//   },
// ];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDownloading } = useDownloaderStore();
  const { layoutSize, setLayoutSize } = useLayoutSize();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={teams} /> */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default"
          data-tauri-drag-region
        >
          <span className="font-bold px-1 text-xl" data-tauri-drag-region>
            BITS GRABBER
          </span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {isDownloading && (
          <div>Is Downloading make this component, disable menus</div>
        )}
        <NavMain items={navMain} />
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={user} /> */}
        <div className="flex items-center">
          <LocaleSwitch />
          <ThemeSwitch />
          <span
            onClick={() => {
              setLayoutSize(layoutSize == "compact" ? "normal" : "compact");
            }}
          >
            Toggle
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WINDOW_CONFIGS, WINDOW_LABEL } from "@/constants";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

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
    title: "Playground",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "History",
        url: "#",
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
  {
    title: "Models",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Genesis",
        url: "#",
      },
      {
        title: "Explorer",
        url: "#",
      },
      {
        title: "Quantum",
        url: "#",
      },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Introduction",
        url: "#",
      },
      {
        title: "Get Started",
        url: "#",
      },
      {
        title: "Tutorials",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    windowLabel: "settings",
    icon: Settings2,
    onClick: () => {
      const settingWindow = new WebviewWindow(WINDOW_LABEL.SETTINGS, {
        ...WINDOW_CONFIGS[WINDOW_LABEL.SETTINGS],
      });
      settingWindow.once("tauri://created", async function () {
        // do the initial action pass from current window
      });
    },
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={teams} /> */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default"
          data-tauri-drag-region
        >
          <span className="font-bold px-1 text-xl" data-tauri-drag-region>BITS GRABBER</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

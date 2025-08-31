import * as React from "react";
import { Settings2, SquareTerminal } from "lucide-react";
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
import { useLayoutSize } from "@/hooks";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { layoutSize, setLayoutSize } = useLayoutSize();
  const handleStopDownloadRef = React.useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const { data } = (event as any).detail;
      console.log("isDownloading", data);
      setIsDownloading(data.isDownloading);
      handleStopDownloadRef.current = data.handleStopDownload || null;
    };
    window.addEventListener("downloading", handleKeyDown);

    return () => window.removeEventListener("downloading", handleKeyDown);
  }, [setIsDownloading]);

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
        <NavMain items={navMain} />
        {/* <NavProjects projects={projects} /> */}
        {isDownloading && (
          <div className="w-full h-full bg-slate-100/80 absolute flex flex-col items-center justify-center opacity-0 hover:opacity-100">
            <span className="text-shadow-2xs mb-2">Downloading...</span>
            <Button
              className="text-nowrap bg-red-600"
              onClick={() => {
                handleStopDownloadRef.current &&
                  handleStopDownloadRef.current();
              }}
            >
              Stop Download
            </Button>
          </div>
        )}
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

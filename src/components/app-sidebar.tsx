"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useAuthStore } from "@/store/auth-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Volleyball, Settings2Icon, FrameIcon, PieChartIcon, MapIcon,
  BriefcaseMedical, VenusAndMars, Beef, Tag
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "La Pelotera Ranch",
      logo: (
          <Volleyball />
      ),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Animales",
      url: "#",
      icon: (
          <Tag />
      ),
      isActive: true,
      items: [
        {
          title: "Ganado",
          url: "#",
        },
        {
          title: "Lotes y Rebaños",
          url: "#",
        },
        {
          title: "Rotación",
          url: "#",
        },
      ],
    },
    {
      title: "Reproducción",
      url: "#",
      icon: (
          <VenusAndMars />
      ),
      items: [
        {
          title: "Servicios",
          url: "#",
        },
        {
          title: "Palpaciones",
          url: "#",
        },
        {
          title: "Partos",
          url: "#",
        },
        {
          title: "Abortos",
          url: "#",
        },
        {
          title: "Genéticas",
          url: "#",
        },
      ],
    },
    {
      title: "Salud",
      url: "#",
      icon: (
          <BriefcaseMedical />
      ),
      items: [
        {
          title: "Historias Clínicas",
          url: "#",
        },
        {
          title: "Diagnósticos",
          url: "#",
        },
        {
          title: "Tratamientos",
          url: "#",
        },
      ],
    },
    {
      title: "Producción",
      url: "#",
      icon: (
          <Beef />
      ),
      items: [
        {
          title: "Ordeños",
          url: "#",
        },
        {
          title: "Pesajes",
          url: "#",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Personal",
          url: "#",
        },
        {
          title: "Terminología",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const storeUser = useAuthStore((state) => state.user)
  const user = storeUser || { name: "Usuario", email: "" }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

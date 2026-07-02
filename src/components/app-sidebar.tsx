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
  BriefcaseMedical, VenusAndMars, Beef, Tag, CreditCardIcon, Sparkles, LocateFixed
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
      items: [
        {
          title: "Ganado",
          url: "/dashboard/livestock",
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
          url: "/dashboard/reproduction/services",
        },
        {
          title: "Revisiones",
          url: "/dashboard/reproduction/revisions",
        },
        {
          title: "Partos",
          url: "/dashboard/reproduction/births",
        },
        {
          title: "Abortos",
          url: "/dashboard/reproduction/aborts",
        },
        {
          title: "Extracciones",
          url: "/dashboard/reproduction/extractions",
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
      name: "IA",
      url: "#",
      icon: (
        <Sparkles />
      ),
    },
    {
      name: "GPS",
      url: "#",
      icon: (
        <LocateFixed/>
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

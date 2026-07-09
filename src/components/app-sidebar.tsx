"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useAuthStore } from "@/store/auth-store"
import { usePermission } from "@/hooks/usePermission"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Volleyball, Settings2Icon, FrameIcon, PieChartIcon, MapIcon,
  BriefcaseMedical, VenusAndMars, Beef, Tag, CreditCardIcon, Sparkles, LocateFixed, CloudSun
} from "lucide-react"

// Menu data with corresponding permissions from Spatie mapping
const data = {
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
          permission: "manage-livestock",
        },
        {
          title: "Lotes",
          url: "/dashboard/batches",
          permission: "manage-batches-paddocks",
        },
        {
          title: "Potreros",
          url: "/dashboard/paddocks",
          permission: "manage-batches-paddocks",
        },
        {
          title: "Certificados",
          url: "/dashboard/certificates",
          permission: "manage-livestock",
        },
        {
          title: "Salidas",
          url: "/dashboard/livestock/outcomes",
          permission: "register-outcomes",
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
          permission: "register-services",
        },
        {
          title: "Revisiones",
          url: "/dashboard/reproduction/revisions",
          permission: "perform-revisions",
        },
        {
          title: "Partos",
          url: "/dashboard/reproduction/births",
          permission: "register-births",
        },
        {
          title: "Abortos",
          url: "/dashboard/reproduction/aborts",
          permission: "register-aborts",
        },
        {
          title: "Extracciones",
          url: "/dashboard/reproduction/extractions",
          permission: "manage-genetic-material",
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
          url: "/dashboard/health/clinic-histories",
          permission: "manage-clinic-histories",
        },
        {
          title: "Calendario / Agenda",
          url: "/dashboard/health/agenda",
          permission: "manage-clinic-histories",
        },
        {
          title: "Diagnósticos",
          url: "/dashboard/health/diagnostics",
          permission: "register-diagnostics",
        },
        {
          title: "Tratamientos",
          url: "/dashboard/health/treatments",
          permission: "apply-treatments",
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
          url: "/dashboard/production/milkings",
          permission: "register-milkings",
        },
        {
          title: "Pesajes",
          url: "/dashboard/production/growths",
          permission: "register-growths",
        },
      ],
    },
    {
      title: "Clima",
      url: "#",
      icon: (
        <CloudSun />
      ),
      items: [
        {
          title: "Temperatura",
          url: "/dashboard/weather/temperature",
        },
        {
          title: "Humedad",
          url: "/dashboard/weather/humidity",
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
          permission: "configure-settings",
        },
        {
          title: "Personal",
          url: "#",
          permission: "manage-users",
        },
        {
          title: "Terminología",
          url: "#",
          permission: "configure-settings",
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
  const { hasPermission } = usePermission()

  // Dynamically filter menu items based on user permissions
  const filteredNavMain = data.navMain.map((group) => {
    const filteredItems = group.items?.filter((item) => {
      if ("permission" in item && typeof item.permission === "string") {
        return hasPermission(item.permission);
      }
      return true;
    });

    return {
      ...group,
      items: filteredItems,
    };
  }).filter((group) => group.items && group.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PaymentsTable } from "@/features/payments"
import { AuthGuard } from "@/features/auth/components/auth-guard"

export default function PaymentsPage() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <DynamicBreadcrumbs />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-6 pt-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
              <p className="text-muted-foreground">
                Visualización de pagos ficticios para probar el componente DataTable reutilizable.
              </p>
            </div>
            <div className="mt-4">
              <PaymentsTable />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}

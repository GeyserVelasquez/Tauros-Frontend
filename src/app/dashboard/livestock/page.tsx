"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivestockTable } from "@/features/livestock";

export default function LivestockPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario de Ganado</h1>
          <p className="text-muted-foreground">
            Gestión, registro y seguimiento del rebaño y animales del rancho.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground">
          <Link href="/dashboard/livestock/create">
            <Plus className="mr-2 h-4 w-4" />
            Registrar Animal
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <LivestockTable />
      </div>
    </div>
  );
}

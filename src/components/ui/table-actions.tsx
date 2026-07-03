"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableActionItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  showSeparatorBefore?: boolean;
}

interface TableActionsProps {
  actions: TableActionItem[];
  label?: string;
  align?: "start" | "center" | "end";
}

export function TableActions({
  actions,
  label = "Acciones",
  align = "end",
}: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 active:scale-95 transition-transform">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="font-montserrat">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, idx) => {
          const Icon = action.icon;
          const isDestructive = action.variant === "destructive";

          const content = (
            <>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </>
          );

          return (
            <React.Fragment key={idx}>
              {action.showSeparatorBefore && <DropdownMenuSeparator />}
              {action.href ? (
                <DropdownMenuItem
                  asChild
                  className={isDestructive ? "text-destructive focus:text-destructive" : ""}
                >
                  <Link href={action.href}>
                    {content}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={action.onClick}
                  className={isDestructive ? "text-destructive focus:text-destructive" : ""}
                >
                  {content}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/40 backdrop-blur-md font-montserrat">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider text-white">
            Tauros<span className="text-zinc-500 font-medium text-lg"> FMS</span>
          </span>
        </Link>

        {/* Links de Navegación */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            Funcionalidades
          </a>
          <a href="#security" className="hover:text-white transition-colors duration-200">
            Seguridad
          </a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">
            Planes
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 text-sm font-medium"
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button
            asChild
            className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-5 rounded-md active:scale-95 transition-transform"
          >
            <Link href="/login">Acceso Premium</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

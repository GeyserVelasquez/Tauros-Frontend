"use client";

import Link from "next/link";
import { HeartPulse, CheckCircle2, Quote, Terminal, GitFork } from "lucide-react";
import { Navbar, HeroSection, BentoFeatures } from "@/features/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-montserrat select-none">
      {/* 1. Header de Navegación */}
      <Navbar />

      {/* 2. Cuerpo Principal */}
      <main className="flex-1">
        {/* Sección Hero */}
        <HeroSection />

        {/* Sección Bento Features */}
        <BentoFeatures />

        {/* Nueva Sección: Ficha Ganadera Digital en Detalle */}
        <section className="py-24 bg-zinc-950/20 border-t border-zinc-950 relative">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              
              {/* Columna izquierda: Ficha Ganadera Mockup */}
              <div className="max-w-md mx-auto lg:mx-0 w-full relative">
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Ficha Biológica Activa
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
                      ID: V-104
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
                        Nombre / Arete
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold text-white">MARQUESA DE ALBA</span>
                        <span className="text-xs font-bold bg-white text-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          ELITE
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 border border-zinc-900/80 rounded-lg p-3">
                        <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-500 block">
                          Categoría
                        </span>
                        <span className="text-sm font-semibold text-zinc-200 mt-0.5 block">Vaca Madre</span>
                      </div>
                      <div className="bg-zinc-900/50 border border-zinc-900/80 rounded-lg p-3">
                        <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-500 block">
                          Causa Ingreso
                        </span>
                        <span className="text-sm font-semibold text-zinc-200 mt-0.5 block">Nacimiento Finca</span>
                      </div>
                    </div>

                    <div className="border border-zinc-900 rounded-lg p-3.5 space-y-2 bg-zinc-900/20">
                      <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-500 block">
                        Genealogía Directa
                      </span>
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Padre:</span>
                          <span className="font-semibold text-zinc-300">Toro Rey (T-201)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-500 block text-[10px]">Madre:</span>
                          <span className="font-semibold text-zinc-300">Duquesa II (V-098)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-emerald-500" />
                        <div>
                          <span className="text-[9px] uppercase font-semibold text-zinc-500 block">
                            Última Palpación
                          </span>
                          <span className="text-xs font-semibold text-zinc-300">24 Jun 2026</span>
                        </div>
                      </div>
                      <span className="bg-emerald-950 border border-emerald-900 text-emerald-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                        Preñada
                  </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Detalles descriptivos */}
              <div>
                <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Gestión Genética Individual
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-3">
                  Trazabilidad al alcance de un toque
                </h3>
                <p className="mt-6 text-zinc-400 text-sm leading-relaxed">
                  Cada animal cuenta con una ficha biológica detallada. Realice un seguimiento exhaustivo desde su nacimiento, causa de ingreso, traslados entre lotes y la asignación del médico veterinario de cabecera.
                </p>
                
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-white block">Árbol Genealógico Completo</span>
                      <span className="text-xs text-zinc-500 block mt-0.5">Control de consanguinidad mapeando padres, abuelos y receptoras.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-white block">Historial Diagnóstico Activo</span>
                      <span className="text-xs text-zinc-500 block mt-0.5">Acceso inmediato a revisiones veterinarias y alertas sanitarias en tiempo real.</span>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Nueva Sección: Sistema Open Source */}
        <section className="py-24 bg-black border-t border-zinc-950 relative">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Columna izquierda: Información */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-6">
                  <GitFork className="h-3.5 w-3.5" />
                  Soberanía de Datos Ganaderos
                </div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Código Abierto para el sector ganadero
                </h2>
                <p className="mt-6 text-zinc-400 text-sm leading-relaxed">
                  Creemos que el control del inventario biológico y la genética del hato debe ser 100% propiedad del productor. El núcleo del sistema LLANOS es de código abierto, auditable y libre de dependencias cautivas.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="https://github.com"
                    target="_blank"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-800 bg-transparent px-6 text-sm font-semibold text-white hover:bg-zinc-900 transition-colors"
                  >
                    <GitFork className="mr-2 h-4 w-4" /> Ver Código Fuente
                  </Link>
                </div>
              </div>

              {/* Columna derecha: Terminal de código simulada */}
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 font-mono text-xs text-zinc-400 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-white/5 blur-[40px] pointer-events-none" />
                  
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-zinc-600" />
                      <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">developer-console</span>
                    </div>
                    <span className="text-[9px] text-zinc-700">sh</span>
                  </div>

                  {/* Terminal Output */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-white">$</span> git clone https://github.com/llanos-fms/frontend.git
                    </div>
                    <div className="text-zinc-600">
                      Cloning into 'llanos-frontend'... <br />
                      remote: Enumerating objects: 1045, done.<br />
                      remote: Total 1045 (delta 610), reused 980 (delta 565)
                    </div>
                    <div>
                      <span className="text-white">$</span> pnpm install && pnpm run dev
                    </div>
                    <div className="text-zinc-500 font-bold">
                      ✓ Ready in 450ms (http://localhost:3000)
                    </div>
                    <div>
                      <span className="text-white">$</span> <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Nueva Sección: Testimonios de Empresas */}
        <section className="py-24 bg-zinc-950/10 border-t border-zinc-950">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Testimonios</span>
              <h2 className="text-3xl font-extrabold sm:text-4xl mt-3 text-white">Casos de éxito en campo</h2>
              <p className="mt-4 text-sm text-zinc-400">
                Productores ganaderos optimizando su eficiencia y rentabilidad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Testimonio 1 */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
                <Quote className="h-8 w-8 text-zinc-700 mb-4" />
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  "La trazabilidad de palpaciones y servicios nos ahorró miles de dólares en abortos no detectados. La interfaz es sumamente intuitiva para el personal de campo."
                </p>
                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Dr. Carlos Ortega</span>
                    <span className="text-[10px] text-zinc-500 block">Médico Veterinario Inspector</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    La Pelotera Ranch
                  </span>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
                <Quote className="h-8 w-8 text-zinc-700 mb-4" />
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  "El sistema responde de inmediato bajo las peores conexiones satelitales en campo. La velocidad de búsqueda por hierro del animal es verdaderamente sobresaliente."
                </p>
                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Ing. María Gómez</span>
                    <span className="text-[10px] text-zinc-500 block">Directora de Operaciones</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Hacienda El Oasis
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 font-montserrat">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold tracking-wider text-white">
              LLANOS<span className="text-zinc-500 font-medium text-sm">.FMS</span>
            </span>
            <p className="text-zinc-500 text-xs">
              SaaS de gestión e inteligencia biológica para haciendas. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#security" className="hover:text-white transition-colors">Seguridad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

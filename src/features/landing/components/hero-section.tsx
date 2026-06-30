"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Activity, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 bg-black text-white font-montserrat">
      {/* Glow effects for luxury aesthetic */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/10 blur-[130px]" />
      <div className="absolute top-12 right-12 -z-10 h-[300px] w-[300px] rounded-full bg-zinc-900/20 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur-md mb-6 uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
          Tecnología de Vanguardia para el Campo
        </div>

        {/* H1 Principal */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl leading-[1.1] max-w-5xl mx-auto text-white">
          La plataforma inteligente para el{" "}
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Control de su Hato
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Un SaaS premium de trazabilidad biológica, control reproductivo y seguridad inmutable diseñado para haciendas exigentes. Tome decisiones basadas en datos reales.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            className="bg-white hover:bg-zinc-200 text-black font-semibold h-12 px-6 rounded-md active:scale-95 transition-transform"
          >
            <Link href="/login" className="flex items-center gap-2">
              Ingresar al Sistema <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900 hover:text-white h-12 px-6 rounded-md active:scale-95 transition-transform"
          >
            <a href="#features">Ver Características</a>
          </Button>
        </div>

        {/* Visual Showcase: Premium Laptop Mockup showing a simulated Dashboard */}
        <div className="mt-16 md:mt-20 relative max-w-5xl mx-auto">
          {/* Laptop Screen Frame */}
          <div className="relative mx-auto border-zinc-800 bg-zinc-900 border-[8px] rounded-t-2xl h-[200px] max-w-[340px] sm:h-[350px] sm:max-w-[600px] md:h-[450px] md:max-w-[780px] lg:h-[510px] lg:max-w-[890px] shadow-2xl">
            <div className="rounded-lg overflow-hidden h-full bg-zinc-950 flex flex-col relative select-none">
              
              {/* Simulated browser header */}
              <div className="h-6 bg-zinc-900 border-b border-zinc-950 flex items-center px-4 gap-1.5 shrink-0">
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-3 w-40 bg-zinc-950 rounded-sm ml-4 border border-zinc-900 flex items-center justify-center text-[7px] text-zinc-600 font-mono">
                  localhost:3000/dashboard
                </div>
              </div>

              {/* Simulated Dashboard Contents */}
              <div className="flex-1 p-3 md:p-6 overflow-hidden flex flex-col justify-between text-left">
                {/* Dashboard Top Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-zinc-900 bg-zinc-900/10 rounded-lg p-3">
                    <span className="text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Total Hato Activo</span>
                    <span className="block text-lg md:text-2xl font-extrabold mt-1 text-white">1,482</span>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-900/10 rounded-lg p-3">
                    <span className="text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Gesta en Curso</span>
                    <span className="block text-lg md:text-2xl font-extrabold mt-1 text-emerald-500">142</span>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-900/10 rounded-lg p-3">
                    <span className="text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Veterinarios Activos</span>
                    <span className="block text-lg md:text-2xl font-extrabold mt-1 text-zinc-300">5</span>
                  </div>
                </div>

                {/* Dashboard Center Graph (Simulated SVG) */}
                <div className="flex-1 my-3 border border-zinc-900 bg-zinc-900/10 rounded-lg p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Curva de Fertilidad y Nacimientos</span>
                    <div className="flex gap-2">
                      <span className="h-1.5 w-6 rounded bg-zinc-600" />
                      <span className="h-1.5 w-6 rounded bg-white" />
                    </div>
                  </div>
                  
                  {/* SVG Chart */}
                  <div className="w-full h-24 sm:h-36 md:h-48 mt-2 flex items-end">
                    <svg className="w-full h-full text-zinc-700" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d="M0,35 Q15,30 30,20 T60,10 T90,5 T100,15"
                        fill="none"
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M0,38 Q18,32 35,28 T70,18 T90,15 T100,28"
                        fill="none"
                        stroke="rgba(161,161,170,0.3)"
                        strokeWidth="1"
                        strokeDasharray="2"
                      />
                      <circle cx="30" cy="20" r="1.5" fill="#FAFAFA" />
                      <circle cx="60" cy="10" r="1.5" fill="#10B981" />
                      <circle cx="90" cy="5" r="1.5" fill="#FAFAFA" />
                    </svg>
                  </div>
                </div>

                {/* Dashboard Footer (Quick Info) */}
                <div className="flex items-center justify-between text-[8px] text-zinc-500 border-t border-zinc-900 pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Conexión Servidor Estable</span>
                  </div>
                  <span>Última actualización: hace unos segundos</span>
                </div>

              </div>
            </div>
          </div>
          {/* Laptop Base Frame */}
          <div className="relative mx-auto bg-zinc-800 rounded-b-2xl h-[12px] max-w-[380px] sm:h-[16px] sm:max-w-[670px] md:h-[22px] md:max-w-[870px] lg:h-[24px] lg:max-w-[990px] shadow-2xl">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[4px] w-[50px] sm:h-[6px] sm:w-[90px] md:h-[8px] md:w-[120px] bg-zinc-900 rounded-b" />
          </div>
        </div>

      </div>
    </section>
  );
}

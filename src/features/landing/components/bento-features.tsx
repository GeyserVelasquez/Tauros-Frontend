"use client";

import { Tag, ShieldCheck, Zap, Heart, GitFork, BarChart3 } from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="features" className="py-24 bg-black text-white font-montserrat relative border-t border-zinc-950">
      {/* Subtle light glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            SaaS de Ingeniería Ganadera
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl mt-3 text-white">
            Control biológico con rigor absoluto
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Una infraestructura digital robusta diseñada para proteger el valor e historial de su hato.
          </p>
        </div>

        {/* Bento Grid Estilizado */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Ficha y Categorización */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Tag className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Categorización Precisa</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Clasifique automáticamente vacas, novillas, terneros, vaquintonas y sementales por arete electrónico o número de marca.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Control Ganadero
            </span>
          </div>

          {/* Card 2: Genealogía y Trazabilidad */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <GitFork className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Genealogía Completa</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Rastree padres biológicos, madres adoptivas o receptoras. Proteja la pureza de sus líneas de sangre sin fallos.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Trazabilidad Genética
            </span>
          </div>

          {/* Card 3: Ciclo Reproductivo */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Ciclo Reproductivo</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Gestione montas naturales, inseminación artificial, transferencias embrionarias, diagnóstico de palpación y abortos.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Reproducción
            </span>
          </div>

          {/* Card 4: Seguridad e Inmutabilidad */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Auditoría Segura</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Historial inalterable de movimientos de lotes y traslados de animales con logs detallados bajo autenticación Sanctum.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Seguridad y Control
            </span>
          </div>

          {/* Card 5: Desempeño Rural */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Carga Instantánea Rural</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Caché optimizada mediante SWR y React Query que mitiga la latencia de red y permite trabajar de manera ágil.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Rendimiento
            </span>
          </div>

          {/* Card 6: Análisis de Datos */}
          <div className="group rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-300 flex flex-col justify-between h-[300px]">
            <div>
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">Estadísticas Clave</h3>
              <p className="text-zinc-500 text-xs mt-2.5 leading-relaxed">
                Tableros con métricas de tasa de preñez, distribución de categorías y balances de rendimiento ganadero.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Métricas e Inteligencia
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

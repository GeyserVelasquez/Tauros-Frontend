import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // React Compiler está desactivado en desarrollo: añade una capa Babel
  // extra sobre Turbopack que multiplica el tiempo de compilación en
  // máquinas con poca RAM. En producción sí lo activamos para los
  // beneficios de auto-memoización.
  reactCompiler: !isDev,

  // Reducir la memoria del servidor de desarrollo de Next.js
  experimental: {
    // Turbopack ya maneja el tree-shaking; esto evita análisis doble
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "recharts",
      "@tanstack/react-query",
      "@tanstack/react-table",
    ],
  },
};

export default nextConfig;

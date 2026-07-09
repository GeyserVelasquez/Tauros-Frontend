import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,

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

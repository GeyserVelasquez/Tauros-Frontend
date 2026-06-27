"use client";

import { use } from "react";
import { LivestockDetail } from "@/features/livestock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AnimalDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <LivestockDetail id={id} />
    </div>
  );
}

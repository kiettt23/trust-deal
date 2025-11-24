"use client";

import { useSuiName } from "@/hooks/useSuiName";
import { Skeleton } from "@/components/ui/skeleton";

export function AddressDisplay({ address }: { address: string }) {
  const { displayName, isLoading, name } = useSuiName(address);

  if (isLoading) {
    return <Skeleton className="h-5 w-24 inline-block bg-slate-800 rounded" />;
  }

  // Nếu có SuiNS (Tên miền) -> Màu xanh, đậm, có @ phía trước cho xịn
  if (name) {
    return (
      <span className="text-blue-400 font-bold hover:underline cursor-pointer transition-colors">
        @{name}
      </span>
    );
  }

  // Nếu không -> Màu xám, font Mono
  return (
    <span className="font-mono text-slate-300 group-hover:text-white transition-colors">
      {displayName}
    </span>
  );
}

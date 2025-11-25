"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPlatformStats,
  getUserStats as fetchUserStats,
} from "@/app/actions/stats";

export interface DealStats {
  totalDeals: number;
  completedDeals: number;
  totalVolume: bigint;
  successRate: number;
  averageDealValue: bigint;
  platformFee: bigint;
}

export interface UserStats {
  address: string;
  dealsCreated: number;
  dealsCompleted: number;
  successRate: number;
  rating: number;
  totalVolume: bigint;
  trustScore: number;
  joinedAt: string;
}

export const useDealStats = (userAddress?: string) => {
  // Gọi server action trực tiếp, không cần HTTP
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dealStats"],
    queryFn: getPlatformStats,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: 2,
  });

  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ["userStats", userAddress],
    enabled: !!userAddress,
    queryFn: async () => {
      if (!userAddress) return null;
      try {
        return await fetchUserStats(userAddress);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        return null;
      }
    },
  });

  return {
    stats,
    statsLoading,
    userStats,
    userStatsLoading,
  };
};

// Helper để format số lớn
export const formatBigNumber = (
  value: bigint | number,
  decimals: number = 2
) => {
  const num = typeof value === "bigint" ? Number(value) : value;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
};

// Helper để format MIST → SUI (1 SUI = 1,000,000,000 MIST)
export const formatMistToSui = (
  mist: bigint | number,
  decimals: number = 2
) => {
  const mistNum = typeof mist === "bigint" ? Number(mist) : mist;
  const sui = mistNum / 1_000_000_000; // Convert MIST to SUI

  if (sui >= 1_000_000) {
    return `${(sui / 1_000_000).toFixed(decimals)}M`;
  }
  if (sui >= 1_000) {
    return `${(sui / 1_000).toFixed(decimals)}K`;
  }
  return sui.toFixed(decimals);
};

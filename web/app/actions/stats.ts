"use server";

import { DealStats, UserStats } from "@/hooks/useDealStats";
import { DealStatus } from "@/lib/sui-client";
import { getAllDeals } from "./deals";

/**
 * Server Action để lấy thống kê nền tảng
 * Lấy dữ liệu thật từ Sui blockchain
 */
export async function getPlatformStats(): Promise<DealStats> {
  try {
    const deals = await getAllDeals();

    const totalDeals = deals.length;
    const completedDeals = deals.filter(
      (d) => d.status === DealStatus.COMPLETED
    ).length;

    const totalVolumeNum = deals
      .filter((d) => d.status === DealStatus.COMPLETED)
      .reduce((sum, deal) => sum + parseInt(deal.amount), 0);

    const successRate =
      totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;
    const averageDealValue =
      completedDeals > 0 ? Math.floor(totalVolumeNum / completedDeals) : 0;
    const platformFee = Math.floor(totalVolumeNum * 0.01);

    return {
      totalDeals,
      completedDeals,
      totalVolume: BigInt(totalVolumeNum),
      successRate: parseFloat(successRate.toFixed(1)),
      averageDealValue: BigInt(averageDealValue),
      platformFee: BigInt(platformFee),
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      totalDeals: 0,
      completedDeals: 0,
      totalVolume: 0n,
      successRate: 0,
      averageDealValue: 0n,
      platformFee: 0n,
    };
  }
}

/**
 * Server Action để lấy thống kê người dùng
 * Lấy dữ liệu thật từ Sui blockchain
 */
export async function getUserStats(address: string): Promise<UserStats> {
  if (!address) {
    throw new Error("Address is required");
  }

  try {
    const allDeals = await getAllDeals();
    const userDeals = allDeals.filter(
      (deal) =>
        deal.seller === address ||
        deal.buyer === address ||
        deal.arbiter === address
    );

    const dealsCreated = userDeals.filter((d) => d.seller === address).length;
    const dealsCompleted = userDeals.filter(
      (d) => d.status === DealStatus.COMPLETED
    ).length;

    const totalVolumeNum = userDeals
      .filter((d) => d.status === DealStatus.COMPLETED)
      .reduce((sum, deal) => sum + parseInt(deal.amount), 0);

    const successRate =
      userDeals.length > 0 ? (dealsCompleted / userDeals.length) * 100 : 0;
    const rating = Math.min(5, 3 + (successRate / 100) * 2);
    const trustScore = Math.min(
      1000,
      Math.floor(dealsCompleted * 50 + successRate * 5)
    );

    const oldestDeal = userDeals.reduce(
      (oldest, deal) => (deal.createdAt < oldest ? deal.createdAt : oldest),
      Date.now()
    );

    return {
      address,
      dealsCreated,
      dealsCompleted,
      successRate: parseFloat(successRate.toFixed(1)),
      rating: parseFloat(rating.toFixed(1)),
      totalVolume: BigInt(totalVolumeNum),
      trustScore,
      joinedAt: new Date(oldestDeal).toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
}

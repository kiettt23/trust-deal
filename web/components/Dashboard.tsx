"use client";

import { DashboardClient } from "@/components/DashboardClient";
import {
  getSuiClient,
  parseDealObject,
  ParsedDeal,
  DealStatus,
} from "@/lib/sui-client";
import { generateChartData } from "@/lib/chart-utils";
import { useEffect, useState } from "react";
import type { DealStats } from "@/hooks/useDealStats";
import type { ChartData } from "@/lib/chart-utils";

export function Dashboard() {
  const [stats, setStats] = useState<DealStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Load deals from localStorage
        const storedIds = localStorage.getItem("deal_ids");
        let deals: ParsedDeal[] = [];

        if (storedIds) {
          const dealIds = JSON.parse(storedIds) as string[];
          const client = getSuiClient();

          const dealObjects = await Promise.all(
            dealIds.map((id) =>
              client
                .getObject({
                  id,
                  options: { showContent: true },
                })
                .catch(() => null)
            )
          );

          deals = dealObjects
            .filter((obj): obj is NonNullable<typeof obj> => obj !== null)
            .map((obj) => parseDealObject(obj))
            .filter((deal): deal is ParsedDeal => deal !== null);
        }

        // Calculate stats from actual deals instead of server action
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

        const platformStats: DealStats = {
          totalDeals,
          completedDeals,
          totalVolume: BigInt(totalVolumeNum),
          successRate: parseFloat(successRate.toFixed(1)),
          averageDealValue: BigInt(averageDealValue),
          platformFee: BigInt(platformFee),
        };

        const charts = generateChartData(deals);

        setStats(platformStats);
        setChartData(charts);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading || !stats || !chartData) {
    return (
      <div className="text-center text-slate-400 py-12">
        Đang tải dashboard...
      </div>
    );
  }

  return <DashboardClient initialStats={stats} chartData={chartData} />;
}

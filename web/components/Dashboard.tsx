"use client";

import { DashboardClient } from "@/components/DashboardClient";
import { getPlatformStats } from "@/app/actions/stats";
import { getSuiClient, parseDealObject, ParsedDeal } from "@/lib/sui-client";
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

        const [platformStats] = await Promise.all([getPlatformStats()]);
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

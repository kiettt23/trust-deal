"use client";

import { ProfileClient } from "@/components/ProfileClient";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DealStatus } from "@/lib/sui-client";
import type { ParsedDeal } from "@/lib/sui-client";
import type { UserStats } from "@/hooks/useDealStats";

export default function ProfilePage() {
  const account = useCurrentAccount();
  const [userDeals, setUserDeals] = useState<ParsedDeal[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!account?.address) {
        setLoading(false);
        return;
      }

      try {
        // Load deals from localStorage (client-side)
        const storedIds = localStorage.getItem("deal_ids");
        let allDeals: ParsedDeal[] = [];

        if (storedIds) {
          const dealIds = JSON.parse(storedIds) as string[];
          const { getSuiClient, parseDealObject } = await import(
            "@/lib/sui-client"
          );
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

          allDeals = dealObjects
            .filter((obj): obj is NonNullable<typeof obj> => obj !== null)
            .map((obj) => parseDealObject(obj))
            .filter((deal): deal is ParsedDeal => deal !== null);
        }

        // Filter user deals
        const deals = allDeals.filter(
          (deal) =>
            deal.seller === account.address ||
            deal.buyer === account.address ||
            deal.arbiter === account.address
        );

        console.log("Profile Debug:", {
          userAddress: account.address,
          totalDeals: allDeals.length,
          userDeals: deals.length,
          deals: deals,
        });

        setUserDeals(deals);

        // Calculate user stats from actual deals
        const dealsCreated = deals.filter(
          (d) => d.seller === account.address
        ).length;
        const dealsCompleted = deals.filter(
          (d) => d.status === DealStatus.COMPLETED
        ).length;

        const totalVolumeNum = deals
          .filter((d) => d.status === DealStatus.COMPLETED)
          .reduce((sum, deal) => sum + parseInt(deal.amount), 0);

        const successRate =
          deals.length > 0 ? (dealsCompleted / deals.length) * 100 : 0;
        const rating = Math.min(5, 3 + (successRate / 100) * 2);
        const trustScore = Math.min(
          1000,
          Math.floor(dealsCompleted * 50 + successRate * 5)
        );

        const oldestDeal =
          deals.length > 0
            ? deals.reduce(
                (oldest, deal) =>
                  deal.createdAt < oldest ? deal.createdAt : oldest,
                Date.now()
              )
            : Date.now();

        const stats: UserStats = {
          address: account.address,
          dealsCreated,
          dealsCompleted,
          successRate: parseFloat(successRate.toFixed(1)),
          rating: parseFloat(rating.toFixed(1)),
          totalVolume: BigInt(totalVolumeNum),
          trustScore,
          joinedAt: new Date(oldestDeal).toISOString(),
        };

        console.log("Profile Stats:", stats);

        setUserStats(stats);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [account?.address]);

  if (!account?.address) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 pt-24 flex items-center justify-center">
        <Card className="bg-slate-900 border-slate-700 shadow-xl">
          <CardContent className="p-12 text-center text-slate-400">
            Vui lòng kết nối ví để xem profile
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading || !userStats) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 pt-24">
        <div className="container mx-auto max-w-4xl space-y-8">
          <Card className="bg-slate-900 border-slate-700 shadow-xl">
            <CardContent className="p-8">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-64 mt-4" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return <ProfileClient userDeals={userDeals} userStats={userStats} />;
}

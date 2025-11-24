"use client";

import { ProfileClient } from "@/components/ProfileClient";
import { getUserDeals } from "@/app/actions/deals";
import { getUserStats } from "@/app/actions/stats";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
        const [deals, stats] = await Promise.all([
          getUserDeals(account.address),
          getUserStats(account.address),
        ]);
        setUserDeals(deals);
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

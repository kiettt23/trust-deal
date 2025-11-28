"use client";

import { DealsClient } from "@/components/DealsClient";
import { useEffect, useState } from "react";
import { getSuiClient, parseDealObject, ParsedDeal } from "@/lib/sui-client";

export default function DealsPage() {
  const [deals, setDeals] = useState<ParsedDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const storedIds = localStorage.getItem("deal_ids");
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

          const parsedDeals = dealObjects
            .filter((obj): obj is NonNullable<typeof obj> => obj !== null)
            .map((obj, index) => {
              const deal = parseDealObject(obj);
              if (deal) {
                // Sử dụng index từ localStorage làm createdAt
                // Index cao hơn = deal mới hơn (vì deal mới được push vào cuối array)
                deal.createdAt = index;
              }
              return deal;
            })
            .filter((deal): deal is ParsedDeal => deal !== null);

          // Đảo ngược để deal mới nhất lên đầu
          setDeals(parsedDeals.reverse());
        }
      } catch (error) {
        console.error("Error loading deals:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 pt-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-slate-400">Đang tải...</div>
        </div>
      </main>
    );
  }

  return <DealsClient initialDeals={deals} />;
}

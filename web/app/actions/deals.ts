"use server";

import { getSuiClient, parseDealObject, ParsedDeal } from "@/lib/sui-client";

// const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "";
// const DEAL_TYPE = `${PACKAGE_ID}::escrow::Deal`;

export async function getAllDeals(): Promise<ParsedDeal[]> {
  try {
    // For demo purposes, get deals from localStorage
    // In production, use indexer or backend API
    if (typeof window !== "undefined") {
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

        const deals = dealObjects
          .filter((obj): obj is NonNullable<typeof obj> => obj !== null)
          .map((obj) => parseDealObject(obj))
          .filter((deal): deal is ParsedDeal => deal !== null);

        return deals;
      }
    }

    // For server-side, return empty (needs proper indexer)
    console.warn("getAllDeals: No indexer available, returning empty array");
    return [];
  } catch (error) {
    console.error("Error fetching all deals:", error);
    return [];
  }
}

export async function getUserDeals(userAddress: string): Promise<ParsedDeal[]> {
  try {
    const allDeals = await getAllDeals();
    return allDeals.filter(
      (deal) =>
        deal.seller === userAddress ||
        deal.buyer === userAddress ||
        deal.arbiter === userAddress
    );
  } catch (error) {
    console.error("Error fetching user deals:", error);
    return [];
  }
}

export async function getDealById(dealId: string): Promise<ParsedDeal | null> {
  try {
    const client = getSuiClient();
    const obj = await client.getObject({
      id: dealId,
      options: {
        showContent: true,
      },
    });

    return parseDealObject(obj);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return null;
  }
}

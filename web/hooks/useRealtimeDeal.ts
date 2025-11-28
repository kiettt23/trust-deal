"use client";

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { PACKAGE_ID, MODULE_NAME } from "@/contracts/config";

interface DealFields {
  seller: string;
  buyer: string | null;
  amount: string;
  status: number;
}

interface UseRealtimeDealOptions {
  dealId: string;
  onUpdate?: (fields: DealFields) => void;
  enabled?: boolean;
}

interface UseRealtimeDealReturn {
  isConnected: boolean;
  lastUpdate: number | null;
  error: string | null;
  reconnect: () => void;
}

/**
 * Hook để theo dõi real-time updates cho một Deal cụ thể
 * Sử dụng Sui WebSocket subscriptions
 */
export function useRealtimeDeal({
  dealId,
  onUpdate,
  enabled = true,
}: UseRealtimeDealOptions): UseRealtimeDealReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const client = useMemo(() => {
    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as
      | "testnet"
      | "mainnet"
      | "devnet";
    return new SuiClient({
      url: getFullnodeUrl(network),
    });
  }, []);

  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!dealId || !enabled) return;

    let isMounted = true;

    const subscribe = async () => {
      try {
        setError(null);

        // Subscribe to events related to this deal
        const unsubscribe = await client.subscribeEvent({
          filter: {
            MoveEventModule: {
              package: PACKAGE_ID,
              module: MODULE_NAME,
            },
          },
          onMessage: async (event) => {
            if (!isMounted) return;

            // Check if this event is related to our deal
            const parsedJson = event.parsedJson as Record<string, unknown>;
            const eventDealId = parsedJson?.deal_id as string;

            if (eventDealId === dealId || !eventDealId) {
              // Fetch latest deal data
              try {
                const dealData = await client.getObject({
                  id: dealId,
                  options: { showContent: true },
                });

                if (dealData.data?.content?.dataType === "moveObject") {
                  const fields = dealData.data.content.fields as Record<
                    string,
                    unknown
                  >;
                  const dealFields: DealFields = {
                    seller: (fields.seller as string) || "",
                    buyer: (fields.buyer as string) || null,
                    amount: (fields.amount as string) || "0",
                    status: parseInt((fields.status as string) || "0"),
                  };

                  if (isMounted) {
                    setLastUpdate(Date.now());
                    onUpdate?.(dealFields);
                  }
                }
              } catch (fetchError) {
                console.error("Error fetching deal update:", fetchError);
              }
            }
          },
        });

        unsubscribeRef.current = unsubscribe;
        if (isMounted) {
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
        }

        console.log(`[Realtime] Subscribed to deal: ${dealId}`);
      } catch (err) {
        console.error("[Realtime] Subscription error:", err);
        if (isMounted) {
          setError("Không thể kết nối real-time");
          setIsConnected(false);
        }

        // Auto-reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts && isMounted) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          );
          reconnectAttemptsRef.current++;

          console.log(
            `[Realtime] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) subscribe();
          }, delay);
        }
      }
    };

    subscribe();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [dealId, enabled, client, onUpdate, cleanup]);

  const reconnect = useCallback(() => {
    cleanup();
    reconnectAttemptsRef.current = 0;
    // Will trigger re-subscribe via useEffect
  }, [cleanup]);

  return {
    isConnected,
    lastUpdate,
    error,
    reconnect,
  };
}

/**
 * Hook để polling deal data (fallback khi WebSocket không hoạt động)
 */
export function usePollingDeal({
  dealId,
  interval = 5000,
  enabled = true,
  onUpdate,
}: {
  dealId: string;
  interval?: number;
  enabled?: boolean;
  onUpdate?: (fields: DealFields) => void;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derive isPolling from enabled and dealId instead of using state
  const isPolling = enabled && !!dealId;

  const fetchDeal = useCallback(async () => {
    if (!dealId) return;

    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as
      | "testnet"
      | "mainnet"
      | "devnet";
    const client = new SuiClient({ url: getFullnodeUrl(network) });

    try {
      const dealData = await client.getObject({
        id: dealId,
        options: { showContent: true },
      });

      if (dealData.data?.content?.dataType === "moveObject") {
        const fields = dealData.data.content.fields as Record<string, unknown>;
        const dealFields: DealFields = {
          seller: (fields.seller as string) || "",
          buyer: (fields.buyer as string) || null,
          amount: (fields.amount as string) || "0",
          status: parseInt((fields.status as string) || "0"),
        };

        onUpdate?.(dealFields);
      }
    } catch (error) {
      console.error("[Polling] Error fetching deal:", error);
    }
  }, [dealId, onUpdate]);

  useEffect(() => {
    // Cleanup previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!enabled || !dealId) {
      return;
    }

    // Initial fetch
    fetchDeal();

    // Set up polling
    intervalRef.current = setInterval(fetchDeal, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dealId, interval, enabled, fetchDeal]);

  return { isPolling, refetch: fetchDeal };
}

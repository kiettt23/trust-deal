import { useCurrentAccount } from "@mysten/dapp-kit";
import { useCallback } from "react";

export interface UserProfile {
  address: string;
  dealsCreated: number;
  dealsCompleted: number;
  rating: number;
  joinedAt: string;
  totalVolume: bigint;
}

export const useAuth = () => {
  const account = useCurrentAccount();

  const isConnected = !!account;

  const getAddress = useCallback(() => {
    return account?.address || null;
  }, [account]);

  const truncateAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    account,
    isConnected,
    getAddress,
    truncateAddress,
  };
};

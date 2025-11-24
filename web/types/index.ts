// Deal Types
export type DealStatus = "created" | "locked" | "completed" | "cancelled";

export interface Deal {
  id: string;
  seller: string;
  buyer?: string;
  amount: bigint;
  status: DealStatus;
  createdAt: Date;
  updatedAt: Date;
  escrowed_balance?: bigint;
}

// User Types
export interface UserProfile {
  address: string;
  dealsCreated: number;
  dealsCompleted: number;
  successRate: number;
  rating: number;
  trustScore: number;
  joinedAt: string;
  totalVolume: bigint;
  reviews?: Review[];
}

export interface Review {
  id: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  dealId: string;
  createdAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  dealId: string;
  type: "create" | "deposit" | "complete" | "refund";
  from: string;
  to?: string;
  amount?: bigint;
  txHash: string;
  status: "pending" | "success" | "failed";
  createdAt: Date;
}

// Stats Types
export interface PlatformStats {
  totalDeals: number;
  completedDeals: number;
  totalVolume: bigint;
  successRate: number;
  averageDealValue: bigint;
  platformFee: bigint;
  activeUsers: number;
  dailyVolume?: bigint;
}

// Error Types
export class TrustDealError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "TrustDealError";
  }
}

export const ErrorCodes = {
  NOT_CONNECTED: "NOT_CONNECTED",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  INVALID_DEAL: "INVALID_DEAL",
  UNAUTHORIZED: "UNAUTHORIZED",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

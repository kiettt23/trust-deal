import {
  SuiClient,
  getFullnodeUrl,
  SuiObjectResponse,
} from "@mysten/sui/client";

let suiClient: SuiClient | null = null;

export function getSuiClient(): SuiClient {
  if (!suiClient) {
    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || "devnet") as
      | "testnet"
      | "mainnet"
      | "devnet";
    suiClient = new SuiClient({
      url: getFullnodeUrl(network),
    });
  }
  return suiClient;
}

export interface ParsedDeal {
  id: string;
  seller: string;
  buyer: string;
  arbiter: string;
  amount: string;
  status: number;
  createdAt: number;
  description: string;
}

export function parseDealObject(obj: SuiObjectResponse): ParsedDeal | null {
  try {
    if (!obj.data || !obj.data.content) return null;

    // Type guard for MoveStruct
    if (obj.data.content.dataType !== "moveObject") return null;

    const fields = obj.data.content.fields as Record<string, unknown>;
    if (!fields) return null;

    return {
      id: obj.data.objectId,
      seller: (fields.seller as string) || "",
      buyer: (fields.buyer as string) || "",
      arbiter: (fields.arbiter as string) || "",
      amount: (fields.amount as string) || "0",
      status: parseInt((fields.status as string) || "0"),
      createdAt: parseInt(
        (fields.created_at as string) || Date.now().toString()
      ),
      description: (fields.description as string) || "",
    };
  } catch (error) {
    console.error("Error parsing deal object:", error);
    return null;
  }
}

export const DealStatus = {
  CREATED: 0,
  LOCKED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
} as const;

export function getStatusLabel(status: number): string {
  switch (status) {
    case DealStatus.CREATED:
      return "Mới tạo";
    case DealStatus.LOCKED:
      return "Đang khóa";
    case DealStatus.COMPLETED:
      return "Hoàn thành";
    case DealStatus.CANCELLED:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

export function formatSuiAmount(amount: string | number): number {
  const amountNum = typeof amount === "string" ? parseInt(amount) : amount;
  return amountNum / 1_000_000_000;
}

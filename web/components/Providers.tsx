"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import "@mysten/dapp-kit/dist/index.css"; // Import CSS mặc định của ví

// Đọc network từ env, mặc định là testnet
const DEFAULT_NETWORK = (process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as
  | "testnet"
  | "devnet"
  | "mainnet";

// Cấu hình mạng
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={DEFAULT_NETWORK}
        onNetworkChange={() => {}}
      >
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

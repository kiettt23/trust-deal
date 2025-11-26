/**
 * Environment Variable Configuration
 * Uses defaults from config.ts if env vars not set
 */

import { PACKAGE_ID, MODULE_NAME, SUI_NETWORK } from "@/contracts/config";

export function getEnv() {
  return {
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || SUI_NETWORK,
    NEXT_PUBLIC_PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || PACKAGE_ID,
    NEXT_PUBLIC_MODULE_NAME: process.env.NEXT_PUBLIC_MODULE_NAME || MODULE_NAME,
  };
}

export const env = getEnv();

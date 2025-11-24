export const PACKAGE_ID =
  process.env.NEXT_PUBLIC_PACKAGE_ID ||
  "0x9399b5c417840b324b9bddaf44c842f8ca324621bf751bc68ff2b29238018de1";

export const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME || "escrow";

// Địa chỉ mạng (dùng để Explorer link tới)
export const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
export const SUI_VIEWER_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

export const CONTRACT = {
  packageId: PACKAGE_ID,
  module: MODULE_NAME,
};

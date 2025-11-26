export const PACKAGE_ID =
  process.env.NEXT_PUBLIC_PACKAGE_ID ||
  "0xda33a7c5e60650b2604e9ff0c791ab84d3a59a351a03953c111e886d54ae6b4d";

export const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME || "escrow";

// Địa chỉ mạng (dùng để Explorer link tới)
export const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
export const SUI_VIEWER_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

export const CONTRACT = {
  packageId: PACKAGE_ID,
  module: MODULE_NAME,
};

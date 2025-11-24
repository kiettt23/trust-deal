/**
 * Environment Variable Validation
 * Validates required environment variables on app startup
 */

export function validateEnv() {
  const required = {
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK,
    NEXT_PUBLIC_PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID,
  };

  const missing: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value || value === "YOUR_PACKAGE_ID_HERE") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing
        .map((k) => `  - ${k}`)
        .join("\n")}\n\n` +
        `Please set them in web/.env.local\n` +
        `Example:\n` +
        `  NEXT_PUBLIC_SUI_NETWORK=devnet\n` +
        `  NEXT_PUBLIC_PACKAGE_ID=0x...`
    );
  }

  return required as {
    NEXT_PUBLIC_SUI_NETWORK: string;
    NEXT_PUBLIC_PACKAGE_ID: string;
  };
}

export const env = validateEnv();

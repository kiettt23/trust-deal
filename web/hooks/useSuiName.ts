import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { truncateAddress } from "@/lib/utils";

export function useSuiName(address: string | null | undefined) {
  const client = useSuiClient();

  const { data: name, isLoading } = useQuery({
    // Chỉ chạy query nếu có địa chỉ hợp lệ
    enabled: !!address && address.startsWith("0x"),
    queryKey: ["sui-name", address],
    queryFn: async () => {
      if (!address) return null;
      // Gọi API của Sui để tìm tên chính (Primary Name)
      const name = await client.resolveNameServiceNames({
        address: address,
        limit: 1, // Chỉ lấy 1 tên
      });

      // Nếu có tên thì trả về tên đầu tiên, không thì null
      return name.data?.[0] ?? null;
    },
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });

  // Helper để hiển thị: Nếu có tên thì hiện tên, không thì hiện địa chỉ rút gọn
  const displayName = name || truncateAddress(address || "");

  return {
    name, // Tên gốc (ví dụ: kiet.sui hoặc null)
    displayName, // Tên để hiển thị (kiet.sui HOẶC 0x123...)
    isLoading,
  };
}

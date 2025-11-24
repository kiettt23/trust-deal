/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusLabel, truncateAddress } from "@/lib/utils";
import { useEscrow } from "@/hooks/useEscrow";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.id as string;
  const { deposit, confirmDelivery, cancelDeal } = useEscrow();
  const account = useCurrentAccount();

  // 1. Fetch dữ liệu từ Blockchain
  const { data, isPending, error } = useSuiClientQuery("getObject", {
    id: dealId,
    options: {
      showContent: true, // Quan trọng: Phải bật cái này mới thấy data bên trong
    },
  });

  // 2. Xử lý Loading & Error
  if (isPending)
    return (
      <div className="text-center p-10 text-slate-400">
        Đang tải dữ liệu từ Blockchain...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500">Lỗi: {error.message}</div>
    );
  if (!data.data)
    return (
      <div className="text-center p-10 text-slate-400">
        Không tìm thấy Deal này!
      </div>
    );

  // 3. Parse dữ liệu (Ép kiểu an toàn)
  // Dữ liệu Move trả về nằm trong content.fields
  const fields =
    data.data.content?.dataType === "moveObject"
      ? (data.data.content.fields as any)
      : null;

  if (!fields) return <div>Dữ liệu không hợp lệ</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-50">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <Card className="w-full max-w-lg bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Chi tiết Giao dịch</CardTitle>
            {/* Hiển thị Status dạng Badge */}
            <Badge
              variant={fields.status === 1 ? "default" : "secondary"}
              className={`text-sm px-3 py-1
                ${
                  fields.status === 0
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : ""
                }
                ${
                  fields.status === 1
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : ""
                }
                ${
                  fields.status === 2
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : ""
                }
              `}
            >
              {getStatusLabel(fields.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Giá trị Deal */}
          <div className="text-center p-6 bg-slate-950 rounded-lg border border-slate-800">
            <p className="text-sm text-slate-500 uppercase tracking-wider">
              Giá trị
            </p>
            <div className="text-4xl font-mono font-bold mt-2 text-white">
              {fields.amount}{" "}
              <span className="text-lg text-slate-500">MIST</span>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-3 text-sm">
            <InfoRow label="Deal ID" value={truncateAddress(dealId)} isCopy />
            <InfoRow
              label="Seller (Người bán)"
              value={truncateAddress(fields.seller)}
            />
            <InfoRow
              label="Buyer (Người mua)"
              value={fields.buyer ? truncateAddress(fields.buyer) : "Chưa có"}
            />
          </div>

          {/* Khu vực nút bấm hành động (Sẽ làm ở bước sau) */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-center text-xs text-slate-500">
              <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
                {/* Case 1: Chưa nạp tiền -> Hiện nút Nạp */}
                {fields.status === 0 && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-500 font-bold"
                    onClick={() =>
                      deposit(dealId, Number(fields.amount), () => {
                        // Sau khi nạp thành công, đợi 1s rồi refresh lại dữ liệu trang
                        setTimeout(() => {
                          // Cách refresh đơn giản nhất là reload trang :))
                          // Hoặc invalidate query nếu em muốn pro hơn
                          window.location.reload();
                        }, 1000);
                      })
                    }
                    disabled={!account} // Phải kết nối ví mới ấn được
                  >
                    {account
                      ? `💸 Nạp ${fields.amount} MIST để khóa kèo`
                      : "Kết nối ví để nạp tiền"}
                  </Button>
                )}
                {/* Case 2: Đã nạp tiền -> Hiện thông báo */}
                {fields.status === 1 && (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-center text-sm flex flex-col gap-2">
                      <span className="font-bold text-lg">
                        🔒 DEAL IS LOCKED
                      </span>
                      <span>
                        Tiền đang nằm trong Smart Contract. Seller vui lòng giao
                        hàng.
                      </span>
                    </div>

                    {/* Chỉ hiện nút này nếu người xem là Buyer */}
                    {/* (Lưu ý: So sánh địa chỉ ví để hiện nút. Nếu account null hoặc không khớp thì disable) */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-500 font-bold h-12 text-lg"
                      onClick={() =>
                        confirmDelivery(dealId, () => {
                          setTimeout(() => window.location.reload(), 1000);
                        })
                      }
                      // Nếu ví đang kết nối KHÔNG PHẢI là Buyer thì không cho bấm
                      disabled={!account || account.address !== fields.buyer}
                    >
                      ✅ Đã nhận hàng (Release Funds)
                    </Button>

                    {(!account || account.address !== fields.buyer) && (
                      <p className="text-xs text-center text-slate-500 italic">
                        * Chỉ Buyer ({truncateAddress(fields.buyer)}) mới có
                        quyền bấm nút này.
                      </p>
                    )}
                  </div>
                )}
                {/* NÚT HỦY KÈO (Dành cho sự cố) */}
                {(fields.status === 0 || fields.status === 1) &&
                  account &&
                  // Chỉ hiện nếu người xem là Seller HOẶC Buyer
                  (account.address === fields.seller ||
                    account.address === fields.buyer) && (
                    <div className="pt-4 mt-4 border-t border-slate-800/50">
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          if (
                            confirm("Bạn có chắc chắn muốn hủy kèo này không?")
                          ) {
                            cancelDeal(dealId, () =>
                              setTimeout(() => window.location.reload(), 1000)
                            );
                          }
                        }}
                      >
                        ⚠️ Hủy kèo & Hoàn tiền (Emergency Cancel)
                      </Button>
                      <p className="text-[10px] text-center text-slate-600 mt-2">
                        * Nếu hủy khi đã nạp tiền, tiền sẽ được trả lại về ví
                        Buyer.
                      </p>
                    </div>
                  )}

                {/* Case: Đã Hủy (Cancelled) */}
                {fields.status === 3 && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                    <h3 className="text-2xl font-bold mb-2">❌ CANCELLED</h3>
                    <p>Giao dịch đã bị hủy. Tiền đã được hoàn trả.</p>
                  </div>
                )}
                {/* Case: Hoàn thành (Completed) */}
                {fields.status === 2 && (
                  <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center">
                    <h3 className="text-2xl font-bold mb-2">🎉 COMPLETED</h3>
                    <p>Giao dịch đã hoàn tất thành công.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

// Component phụ hiển thị dòng thông tin cho gọn code
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
  isCopy?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-200 flex items-center gap-2">
        {value}
      </span>
    </div>
  );
}

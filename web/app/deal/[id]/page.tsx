"use client";

import { useState, useCallback } from "react";
import { useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusLabel, truncateAddress } from "@/lib/utils";
import { useEscrow } from "@/hooks/useEscrow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/CopyButton";
import { AddressDisplay } from "@/components/AddressDisplay";
import { DealTimeline } from "@/components/DealTimeline";
import {
  RealtimeIndicator,
  UpdateNotification,
} from "@/components/RealtimeIndicator";
import { usePollingDeal } from "@/hooks/useRealtimeDeal";
import {
  Wallet,
  Lock,
  CheckCircle2,
  XCircle,
  ArrowDownToLine,
  PartyPopper,
  ShieldX,
  Lightbulb,
  Link2,
  User,
  UserCheck,
  Coins,
  FileText,
} from "lucide-react";

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.id as string;
  const { deposit, confirmDelivery, cancelDeal } = useEscrow();
  const account = useCurrentAccount();

  // State for real-time updates
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);

  // 1. Fetch dữ liệu từ Blockchain
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id: dealId,
    options: {
      showContent: true,
    },
  });

  // 2. Real-time polling để cập nhật UI tự động
  const handleRealtimeUpdate = useCallback(
    (fields: { status: number; buyer: string | null }) => {
      // Chỉ hiện notification khi status thay đổi
      if (lastStatus !== null && lastStatus !== fields.status) {
        setShowUpdateNotification(true);
        refetch(); // Refetch để cập nhật UI
      }
      setLastStatus(fields.status);
      setLastUpdateTime(Date.now());
    },
    [lastStatus, refetch]
  );

  const { isPolling } = usePollingDeal({
    dealId,
    interval: 3000, // Poll mỗi 3 giây
    enabled: !!dealId && !isPending,
    onUpdate: handleRealtimeUpdate,
  });

  // 2. Xử lý Loading: Hiện Skeleton thay vì text "Đang tải..."
  if (isPending) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950">
        <div className="absolute top-4 right-4">
          <Skeleton className="h-10 w-32 bg-slate-800 rounded-lg" />
        </div>
        <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl">
          <CardHeader className="border-b border-slate-800 pb-4 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 bg-slate-800" />
              <Skeleton className="h-5 w-16 rounded-full bg-slate-800" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-32 w-full rounded-lg bg-slate-800" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full bg-slate-800" />
              <Skeleton className="h-6 w-full bg-slate-800" />
              <Skeleton className="h-6 w-full bg-slate-800" />
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        Lỗi: {error.message}
      </div>
    );

  if (!data.data)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Không tìm thấy Deal này!
      </div>
    );

  // 3. Parse dữ liệu
  const fields =
    data.data.content?.dataType === "moveObject" // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (data.data.content.fields as any)
      : null;

  if (!fields) return <div>Dữ liệu không hợp lệ</div>;

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 text-slate-50 relative">
      {/* Real-time Update Notification */}
      <UpdateNotification
        show={showUpdateNotification}
        message="Deal đã được cập nhật!"
        onClose={() => setShowUpdateNotification(false)}
      />

      <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl text-slate-100">
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">
                  Chi tiết Giao dịch
                </CardTitle>
                {/* Real-time Indicator */}
                <RealtimeIndicator
                  isConnected={isPolling}
                  lastUpdate={lastUpdateTime}
                />
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant={fields.status === 1 ? "default" : "secondary"}
              className={`text-sm px-3 py-1 border font-semibold
                ${
                  fields.status === 0
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                    : ""
                }
                ${
                  fields.status === 1
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                    : ""
                }
                ${
                  fields.status === 2
                    ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                    : ""
                }
                ${
                  fields.status === 3
                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
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
          <div className="text-center p-8 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden group">
            {/* Hiệu ứng nền nhẹ */}
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Giá trị Hợp đồng
              </p>
            </div>
            <div className="text-5xl font-mono font-bold text-white tracking-tighter">
              {(Number(fields.amount) / 1_000_000_000).toFixed(2)}{" "}
              <span className="text-xl text-slate-500 font-normal">SUI</span>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-1 bg-slate-800/30 p-4 rounded-lg border border-slate-800">
            <InfoRow
              label="Deal Link"
              value={dealId}
              displayValue={truncateAddress(dealId)}
              isShareLink
              icon={<Link2 className="h-4 w-4" />}
            />
            <InfoRow
              label="Seller"
              value={fields.seller}
              isSuiName
              isCopyable
              icon={<User className="h-4 w-4" />}
            />
            <InfoRow
              label="Buyer"
              value={fields.buyer}
              displayValue={fields.buyer ? undefined : "Chưa có"}
              isSuiName
              isCopyable
              icon={<UserCheck className="h-4 w-4" />}
            />
          </div>
          {/* Khu vực Action Buttons */}
          <div className="pt-2">
            {/* Case 1: Created (Chưa nạp) */}
            {fields.status === 0 && (
              <div className="flex flex-col gap-3">
                {/* Nếu chưa connect ví thì nút Connect ở trên đã lo rồi, ở đây nhắc nhở thôi */}
                {!account && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400 p-3 bg-slate-800 rounded-lg mb-2">
                    <Wallet className="h-4 w-4" />
                    <span>Vui lòng kết nối ví để thực hiện nạp tiền</span>
                  </div>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 font-bold h-12 text-base shadow-lg shadow-blue-900/20 gap-2"
                  onClick={() =>
                    deposit(dealId, Number(fields.amount), () => {
                      setTimeout(() => window.location.reload(), 1000);
                    })
                  }
                  disabled={!account}
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  Nạp {(Number(fields.amount) / 1_000_000_000).toFixed(2)} SUI
                  để khóa kèo
                </Button>
              </div>
            )}

            {/* Case 2: Locked (Đã nạp) */}
            {fields.status === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-center text-sm flex flex-col gap-2">
                  <span className="font-bold text-lg flex items-center justify-center gap-2">
                    <Lock className="h-5 w-5" />
                    DEAL IS LOCKED
                  </span>
                  <span className="opacity-80">
                    Tiền đang nằm trong Két sắt. Seller vui lòng giao hàng.
                  </span>
                </div>

                {/* Nút Confirm (Chỉ hiện cho Buyer) */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-500 font-bold h-12 text-lg shadow-lg shadow-green-900/20 gap-2"
                  onClick={() =>
                    confirmDelivery(dealId, () => {
                      setTimeout(() => window.location.reload(), 1000);
                    })
                  }
                  // Disable nếu không phải Buyer
                  disabled={!account || account.address !== fields.buyer}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Đã nhận hàng (Release Funds)
                </Button>

                {/* Ghi chú cho người không phải Buyer */}
                {(!account || account.address !== fields.buyer) && (
                  <p className="text-xs text-center text-slate-500 italic">
                    * Chỉ Buyer mới có quyền xác nhận đã nhận hàng.
                  </p>
                )}
              </div>
            )}

            {/* Nút Hủy Kèo (Emergency) */}
            {(fields.status === 0 || fields.status === 1) &&
              account &&
              (account.address === fields.seller ||
                account.address === fields.buyer) && (
                <div className="pt-6 mt-6 border-t border-slate-800/50">
                  {/* Ghi chú về quyền hủy */}
                  <p className="text-xs text-center text-slate-500 mb-3 flex items-center justify-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    {fields.status === 0
                      ? "Deal chưa có người mua - có thể hủy tự do"
                      : "Nếu hủy, tiền sẽ được hoàn lại cho Buyer"}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm gap-2"
                    onClick={() => {
                      const confirmMsg =
                        fields.status === 0
                          ? "Bạn có chắc chắn muốn hủy deal này không?"
                          : "CẢNH BÁO: Tiền sẽ được hoàn lại cho Buyer. Bạn có chắc chắn?";
                      if (confirm(confirmMsg)) {
                        cancelDeal(dealId, () =>
                          setTimeout(() => window.location.reload(), 1000)
                        );
                      }
                    }}
                  >
                    <ShieldX className="h-4 w-4" />
                    Hủy kèo{fields.status === 1 ? " & Hoàn tiền cho Buyer" : ""}
                  </Button>
                </div>
              )}

            {/* Case: Completed */}
            {fields.status === 2 && (
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PartyPopper className="h-7 w-7" />
                  <h3 className="text-2xl font-bold">COMPLETED</h3>
                </div>
                <p>Giao dịch thành công. Tiền đã về ví Seller.</p>
              </div>
            )}

            {/* Case: Cancelled */}
            {fields.status === 3 && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-7 w-7" />
                  <h3 className="text-2xl font-bold">CANCELLED</h3>
                </div>
                <p>Giao dịch đã bị hủy. Tiền đã hoàn trả.</p>
              </div>
            )}
          </div>
        </CardContent>
        {/* Phần Timeline giả lập cho giống SaaS */}
        <DealTimeline status={fields.status} sellerAddress={fields.seller} />
      </Card>
    </main>
  );
}

function InfoRow({
  label,
  value,
  displayValue,
  isShareLink,
  isCopyable,
  isSuiName,
  icon,
}: {
  label: string;
  value: string;
  displayValue?: string;
  isShareLink?: boolean;
  isCopyable?: boolean;
  isSuiName?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 px-2 rounded transition-colors -mx-2">
      <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
      </span>
      <div className="flex items-center gap-3">
        {/* Nội dung chính */}
        <div className="text-right">
          {isShareLink ? (
            <span className="font-mono text-slate-200 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">
              {displayValue || value}
            </span>
          ) : isSuiName && value ? (
            <AddressDisplay address={value} />
          ) : (
            <span className="font-mono text-slate-200 text-sm">
              {displayValue || value}
            </span>
          )}
        </div>

        {/* Nút Copy nằm gọn bên cạnh */}
        {(isShareLink || (isCopyable && value)) && (
          <CopyButton
            text={isShareLink ? undefined : value}
            isUrl={isShareLink}
            label={isShareLink ? "Đã copy link chia sẻ" : "Đã copy địa chỉ ví"}
          />
        )}
      </div>
    </div>
  );
}

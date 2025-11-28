"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEscrow } from "@/hooks/useEscrow";
import {
  PlusCircle,
  Wallet,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CreateDealModalProps {
  trigger?: React.ReactNode;
  variant?: "desktop" | "mobile";
}

export function CreateDealModal({
  trigger,
  variant = "desktop",
}: CreateDealModalProps) {
  const router = useRouter();
  const account = useCurrentAccount();
  const { createDeal } = useEscrow();

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = () => {
    // Validation
    if (!price) {
      setError("Vui lòng nhập số tiền");
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Số tiền phải lớn hơn 0");
      return;
    }

    if (numPrice < 0.01) {
      setError("Số tiền tối thiểu là 0.01 SUI");
      return;
    }

    if (numPrice > 1000000) {
      setError("Số tiền tối đa là 1,000,000 SUI");
      return;
    }

    setError("");
    setLoading(true);

    // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
    const amountInMist = Math.floor(numPrice * 1_000_000_000);

    try {
      createDeal(
        amountInMist,
        (dealId) => {
          setLoading(false);
          setOpen(false);
          setPrice("");

          // Save deal ID to localStorage for listing
          const storedIds = localStorage.getItem("deal_ids");
          const dealIds = storedIds ? JSON.parse(storedIds) : [];
          if (!dealIds.includes(dealId)) {
            dealIds.push(dealId);
            localStorage.setItem("deal_ids", JSON.stringify(dealIds));
          }

          router.push(`/deal/${dealId}`);
        },
        // Error callback
        () => {
          setLoading(false);
          setError("Có lỗi xảy ra, vui lòng thử lại");
        }
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setPrice("");
      setError("");
      setLoading(false);
    }
  };

  // Default trigger button
  const defaultTrigger =
    variant === "mobile" ? (
      <Button size="sm" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="h-4 w-4" />
        Tạo Deal Mới
      </Button>
    ) : (
      <Button
        size="sm"
        className="gap-2 h-10 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Tạo Deal</span>
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-white" />
            </div>
            Tạo Deal Mới
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Tạo giao dịch escrow an toàn trên Sui blockchain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!account ? (
            // Not connected state
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-slate-500" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-300 font-medium">Chưa kết nối ví</p>
                <p className="text-sm text-slate-500">
                  Vui lòng kết nối Sui Wallet để tạo giao dịch
                </p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                  <span>👆</span>
                  <span>Nhấn nút Connect Wallet ở góc phải màn hình</span>
                </p>
              </div>
            </div>
          ) : (
            // Connected state - show form
            <>
              {/* Input field */}
              <div className="space-y-3">
                <Label htmlFor="modal-price" className="text-slate-200">
                  Giá trị giao dịch (SUI)
                </Label>
                <div className="relative">
                  <Input
                    id="modal-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Ví dụ: 10.5"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setError("");
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading && price) {
                        handleCreate();
                      }
                    }}
                    className="bg-slate-800 border-slate-700 h-12 text-lg pr-16 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    SUI
                  </span>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}

                {/* Helper text */}
                <p className="text-xs text-slate-500">
                  💡 Số tiền sẽ được khóa trong smart contract cho đến khi buyer
                  xác nhận nhận hàng
                </p>
              </div>

              {/* Preview */}
              {price && Number(price) > 0 && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                    Xem trước
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Giá trị deal:</span>
                    <span className="text-2xl font-bold text-white">
                      {Number(price).toFixed(2)}{" "}
                      <span className="text-sm text-slate-500">SUI</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Bạn là:</span>
                    <span className="text-blue-400 font-medium">Seller</span>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCreate}
                disabled={loading || !price}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang tạo deal...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Tạo Smart Contract</span>
                  </div>
                )}
              </Button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  An toàn
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  Phi tập trung
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                  Sui Blockchain
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

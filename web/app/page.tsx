"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEscrow } from "@/hooks/useEscrow";

export default function Home() {
  const router = useRouter();
  const account = useCurrentAccount(); // Lấy thông tin ví đang kết nối
  const { createDeal } = useEscrow(); // Lấy hàm từ hook

  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!price) return;
    setLoading(true);
    // Gọi hàm tạo deal với giá trị nhập vào
    createDeal(Number(price), (dealId) => {
      setLoading(false);
      router.push(`/deal/${dealId}`);
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-8  text-slate-100 relative z-10">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            TrustDeal
          </h1>
          <p className="text-slate-400">
            Nền tảng giao dịch đảm bảo P2P an toàn nhất.
          </p>
        </div>

        {/* Main Card */}
        {account ? (
          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle>Tạo giao dịch mới</CardTitle>
              <CardDescription>
                Nhập số tiền bạn muốn bán (Đơn vị: MIST)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá trị (MIST)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Ví dụ: 1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="bg-slate-800 border-slate-700"
                />
                <p className="text-xs text-slate-500">
                  * 1 SUI = 1,000,000,000 MIST
                </p>
              </div>

              <Button
                className="w-full h-12 text-base font-medium
    bg-slate-950 text-slate-50 
    border border-slate-800
    shadow-sm hover:bg-slate-900 hover:border-slate-700
    transition-all duration-200"
                onClick={handleCreate}
                disabled={loading || !price}
              >
                {loading ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Đang khởi tạo trên Blockchain...</span>
                  </div>
                ) : (
                  "Tạo Smart Contract"
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6 text-center text-slate-400">
              Vui lòng kết nối ví để bắt đầu giao dịch.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

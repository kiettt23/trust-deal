"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 pt-24 flex items-center justify-center">
      <Card className="bg-slate-900 border-red-900 max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-50">
            Lỗi khi tải Dashboard
          </h2>
          <p className="text-slate-400 text-sm">
            {error.message || "Không thể tải dữ liệu từ blockchain"}
          </p>
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              Thử lại
            </Button>
            <p className="text-xs text-slate-500">
              Nếu lỗi vẫn tiếp diễn, vui lòng kiểm tra:
              <br />- PACKAGE_ID trong .env.local
              <br />- Kết nối internet
              <br />- Sui network status
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

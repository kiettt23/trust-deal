"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  CheckCircle,
  XCircle,
  Lock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Deal {
  id: string;
  seller: string;
  buyer?: string;
  amount: number;
  status: "created" | "locked" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface DealListProps {
  deals: Deal[];
}

const statusConfig = {
  created: {
    label: "Mới tạo",
    icon: Clock,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  locked: {
    label: "Đang khóa",
    icon: Lock,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAmount(amount: number) {
  return (amount / 1_000_000_000).toFixed(2);
}

function formatDate(date: Date, index?: number) {
  // Nếu date không hợp lệ (vì createdAt chỉ là index), hiển thị # thứ tự
  const timestamp = date.getTime();

  // Nếu timestamp quá nhỏ (< năm 2020), nó là index không phải timestamp thực
  if (timestamp < 1577836800000) {
    // 2020-01-01
    return `#${index !== undefined ? index + 1 : "N/A"}`;
  }

  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

export function DealList({ deals }: DealListProps) {
  if (deals.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-700 shadow-xl">
        <CardContent className="p-12 text-center">
          <p className="text-slate-400">Không tìm thấy giao dịch nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {deals.map((deal, index) => {
        const status = statusConfig[deal.status];
        const StatusIcon = status.icon;

        return (
          <Card
            key={deal.id}
            className="bg-slate-900 border-slate-700 shadow-xl hover:border-slate-700 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-mono text-slate-400">
                    {formatAddress(deal.id)}
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {formatDate(deal.createdAt, index)}
                  </p>
                </div>
                <Badge className={`gap-1 ${status.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Amount */}
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Số tiền</p>
                <p className="text-2xl font-bold text-slate-50">
                  {formatAmount(deal.amount)} SUI
                </p>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-400">Seller:</span>
                  <span className="text-slate-200 font-mono">
                    {formatAddress(deal.seller)}
                  </span>
                </div>
                {deal.buyer && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-400">Buyer:</span>
                    <span className="text-slate-200 font-mono">
                      {formatAddress(deal.buyer)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <Link href={`/deal/${deal.id}`} className="block">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-slate-700 hover:bg-slate-800"
                >
                  Xem chi tiết
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

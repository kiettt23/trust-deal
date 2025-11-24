"use client";

import { useAuth } from "@/hooks/useAuth";
import { formatBigNumber, DealStats } from "@/hooks/useDealStats";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, TrendingUp, Users, CheckCircle, Info } from "lucide-react";

import type { ChartData } from "@/lib/chart-utils";

interface DashboardClientProps {
  initialStats: DealStats;
  chartData: ChartData;
}

/**
 * Client Component - Hiển thị dashboard với interaction
 * Nhận dữ liệu từ Server Component
 */
export function DashboardClient({
  initialStats,
  chartData,
}: DashboardClientProps) {
  const { volumeData, dealStatusData } = chartData;
  const { isConnected, truncateAddress, getAddress } = useAuth();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Vui lòng kết nối ví để xem dashboard</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Xin chào, {truncateAddress(getAddress() || "")}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-400 hover:text-slate-200">
                <Info className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dashboard cập nhật real-time từ blockchain</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-800" />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng Giao Dịch"
            value={initialStats.totalDeals}
            description="Trên nền tảng"
            icon={<Activity className="h-4 w-4" />}
            trend={12}
            variant="success"
          />

          <Card className="bg-slate-900 border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thành Công</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {initialStats.completedDeals}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {initialStats.successRate.toFixed(1)}% success rate
              </p>
              <Progress value={initialStats.successRate} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <StatsCard
            title="Khối Lượng"
            value={`${formatBigNumber(initialStats.totalVolume)} SUI`}
            description="Tổng giá trị giao dịch"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={15}
            variant="warning"
          />

          <StatsCard
            title="Người Dùng Hoạt Động"
            value="2,458"
            description="Tháng này"
            icon={<Users className="h-4 w-4" />}
            trend={5}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Volume Chart */}
          <Card className="bg-slate-900 border-slate-700 shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle>Khối Lượng Giao Dịch (7 Ngày)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Pie Chart */}
          <Card className="bg-slate-900 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle>Trạng Thái Giao Dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dealStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dealStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="bg-slate-900 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle>Hoạt Động Hàng Ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                />
                <Line type="monotone" dataKey="volume" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

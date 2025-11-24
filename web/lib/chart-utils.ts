import { ParsedDeal, DealStatus } from "./sui-client";

export interface ChartData {
  volumeData: Array<{ name: string; volume: number }>;
  dealStatusData: Array<{ name: string; value: number; fill: string }>;
}

/**
 * Generate chart data from real blockchain deals
 */
export function generateChartData(deals: ParsedDeal[]): ChartData {
  // Deal Status Distribution
  const created = deals.filter((d) => d.status === DealStatus.CREATED).length;
  const locked = deals.filter((d) => d.status === DealStatus.LOCKED).length;
  const completed = deals.filter(
    (d) => d.status === DealStatus.COMPLETED
  ).length;
  const cancelled = deals.filter(
    (d) => d.status === DealStatus.CANCELLED
  ).length;

  const dealStatusData = [
    { name: "Hoàn thành", value: completed, fill: "#10b981" },
    { name: "Đang khóa", value: locked, fill: "#f59e0b" },
    { name: "Mới tạo", value: created, fill: "#3b82f6" },
    { name: "Đã hủy", value: cancelled, fill: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Volume by Day (Last 7 Days)
  const now = Date.now();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      timestamp: date.setHours(0, 0, 0, 0),
      volume: 0,
    };
  });

  // Aggregate completed deals by day
  deals
    .filter((d) => d.status === DealStatus.COMPLETED)
    .forEach((deal) => {
      const dealDate = new Date(deal.createdAt).setHours(0, 0, 0, 0);
      const dayIndex = last7Days.findIndex((d) => d.timestamp === dealDate);
      if (dayIndex !== -1) {
        last7Days[dayIndex].volume += parseInt(deal.amount) / 1_000_000_000; // Convert MIST to SUI
      }
    });

  const volumeData = last7Days.map((day) => ({
    name: day.name,
    volume: Math.round(day.volume * 100) / 100, // Round to 2 decimals
  }));

  return {
    volumeData,
    dealStatusData,
  };
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEAL_STATUS = {
  0: "Created", // Mới tạo
  1: "Locked", // Đã nạp tiền
  2: "Completed", // Hoàn thành
  3: "Cancelled", // Đã hủy
};

export function getStatusLabel(status: number) {
  return DEAL_STATUS[status as keyof typeof DEAL_STATUS] || "Unknown";
}

export function truncateAddress(addr: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

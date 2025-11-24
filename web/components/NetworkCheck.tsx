"use client";

import { useCurrentAccount, useSuiClientContext } from "@mysten/dapp-kit";

export function NetworkCheck() {
  const account = useCurrentAccount();
  const ctx = useSuiClientContext();

  // Debug: Em bật F12 console lên xem nó in ra gì khi chuyển mạng
  console.log("Current Network:", ctx.network);

  // 1. Nếu chưa kết nối ví -> Không cần báo
  if (!account) return null;

  // 2. Kiểm tra mạng
  // Logic: Nếu tên mạng KHÔNG chứa chữ "devnet" -> Báo lỗi
  const isDevnet = ctx.network && ctx.network.includes("devnet");

  if (isDevnet) return null; // Đúng mạng thì ẩn đi

  return (
    // [FIX] Dùng fixed + z-index cao ngất ngưởng để đè lên mọi thứ
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 animate-bounce">
      <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-2 border-red-400 font-bold flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex flex-col text-sm">
          <span>SAI MẠNG LƯỚI!</span>
          <span className="font-normal opacity-90">
            Vui lòng chuyển ví sang <b>Devnet</b>.
          </span>
        </div>
      </div>
    </div>
  );
}

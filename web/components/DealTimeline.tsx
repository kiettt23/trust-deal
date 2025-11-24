interface TimelineItemProps {
  active: boolean;
  title: string;
  desc: string;
  isLast?: boolean;
  variant?: "default" | "destructive";
}

export function DealTimeline({
  status,
  sellerAddress,
}: {
  status: number;
  sellerAddress: string;
}) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 px-1 ml-3">
        Lịch sử Hoạt động
      </h4>

      <div className="relative pl-6">
        {/* [FIX] Logic đường kẻ thông minh hơn: 
            Nó sẽ nối từ Item 1 đến Item cuối cùng đang hiển thị.
            Thay vì bottom-2 cố định, ta dùng calc để nó dừng đúng chỗ.
        */}
        <div
          className="absolute left-[31px] top-2 w-px bg-slate-800"
          style={{ bottom: "24px" }} // Cách đáy 1 đoạn để không lòi ra khỏi item cuối
        />

        <TimelineItem
          active={true}
          title="Hợp đồng khởi tạo"
          desc={`Deal được tạo bởi ${sellerAddress?.slice(0, 6)}...`}
        />

        <TimelineItem
          active={status >= 1}
          title="Đã nạp tiền (Locked)"
          desc={
            status >= 1
              ? "Buyer đã nạp tiền vào Smart Contract"
              : "Đang chờ Buyer nạp tiền..."
          }
        />

        {status >= 2 && (
          <TimelineItem
            active={status === 2}
            title="Hoàn tất"
            desc="Giao dịch thành công. Tiền đã về ví Seller."
            isLast={true}
          />
        )}

        {status === 3 && (
          <TimelineItem
            active={true}
            title="Đã hủy"
            desc="Giao dịch bị hủy & hoàn tiền."
            isLast={true}
            variant="destructive"
          />
        )}
      </div>
    </div>
  );
}

function TimelineItem({
  active,
  title,
  desc,
  isLast,
  variant = "default",
}: TimelineItemProps) {
  let dotStyle = "bg-slate-900 border-slate-700";
  let glowEffect = "";

  if (active) {
    if (variant === "destructive") {
      dotStyle = "bg-red-500 border-red-500";
      glowEffect = "shadow-[0_0_0_4px_rgba(239,68,68,0.2)] animate-pulse"; // [FIX] Thêm animate-pulse
    } else {
      dotStyle = "bg-blue-500 border-blue-500";
      glowEffect = "shadow-[0_0_0_4px_rgba(59,130,246,0.2)] animate-pulse"; // [FIX] Thêm animate-pulse
    }
  }

  return (
    <div className={`relative flex gap-6 ${isLast ? "pb-0" : "pb-8"}`}>
      {/* Dot */}
      <div
        className={`relative z-10 h-4 w-4 rounded-full border shrink-0 transition-all duration-500 mt-1 ${dotStyle} ${glowEffect}`}
      />

      <div className="-mt-0.5">
        <p
          className={`text-sm font-medium transition-colors ${
            active ? "text-slate-200" : "text-slate-500"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

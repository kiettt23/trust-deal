"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({
  text,
  label,
  isUrl = false,
}: {
  text?: string;
  label?: string;
  isUrl?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Nếu isUrl = true hoặc không có text -> Copy link trình duyệt
      const contentToCopy = text || window.location.href;

      await navigator.clipboard.writeText(contentToCopy);
      setIsCopied(true);
      toast.success(label || "Đã sao chép liên kết!");

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi sao chép!");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 hover:bg-slate-700/50"
      onClick={handleCopy}
      title={label || "Copy"}
    >
      {isCopied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : isUrl ? (
        // Icon Link cho trường hợp copy URL
        <LinkIcon className="h-3 w-3 text-blue-400" />
      ) : (
        <Copy className="h-3 w-3 text-slate-400" />
      )}
    </Button>
  );
}

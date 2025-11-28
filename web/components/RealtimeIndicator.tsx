"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealtimeIndicatorProps {
  isConnected: boolean;
  lastUpdate: number | null;
  error?: string | null;
  onReconnect?: () => void;
  className?: string;
}

export function RealtimeIndicator({
  isConnected,
  lastUpdate,
  error,
  onReconnect,
  className,
}: RealtimeIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  // Update "time ago" every second
  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastUpdate) / 1000);

      if (seconds < 5) {
        setTimeAgo("vừa xong");
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s trước`);
      } else if (seconds < 3600) {
        setTimeAgo(`${Math.floor(seconds / 60)}m trước`);
      } else {
        setTimeAgo(`${Math.floor(seconds / 3600)}h trước`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20",
          className
        )}
      >
        <WifiOff className="h-3 w-3" />
        <span>Mất kết nối</span>
        {onReconnect && (
          <button
            onClick={onReconnect}
            className="ml-1 hover:text-red-300 transition-colors"
            title="Thử kết nối lại"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs px-2 py-1 rounded-full border transition-colors",
        isConnected
          ? "text-green-400 bg-green-500/10 border-green-500/20"
          : "text-slate-500 bg-slate-500/10 border-slate-500/20",
        className
      )}
    >
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Live</span>
          {lastUpdate && timeAgo && (
            <span className="text-slate-500">• {timeAgo}</span>
          )}
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3 animate-pulse" />
          <span>Đang kết nối...</span>
        </>
      )}
    </div>
  );
}

/**
 * Toast notification khi có update mới
 */
export function UpdateNotification({
  show,
  message,
  onClose,
}: {
  show: boolean;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

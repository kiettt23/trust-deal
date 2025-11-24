"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: number; // positive or negative percentage
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-linear-to-br from-green-950 to-slate-900 border-green-800";
      case "warning":
        return "bg-linear-to-br from-yellow-950 to-slate-900 border-yellow-800";
      case "danger":
        return "bg-linear-to-br from-red-950 to-slate-900 border-red-800";
      default:
        return "bg-linear-to-br from-slate-800 to-slate-900 border-slate-700";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-slate-400";
    return trend > 0 ? "text-green-400" : "text-red-400";
  };

  return (
    <Card
      className={`${getVariantStyles()} hover:border-slate-600 transition-all shadow-xl`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">
          {title}
        </CardTitle>
        {icon && <div className="text-slate-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-50">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-slate-400">{description}</p>
            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-xs ${getTrendColor()}`}
              >
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

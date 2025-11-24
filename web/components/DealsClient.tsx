"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DealList } from "@/components/DealList";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ParsedDeal } from "@/lib/sui-client";

interface DealsClientProps {
  initialDeals: ParsedDeal[];
}

export function DealsClient({ initialDeals }: DealsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");

  const filteredDeals = useMemo(() => {
    let deals = [...initialDeals];

    // Filter by search
    if (searchQuery) {
      deals = deals.filter(
        (deal) =>
          deal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.buyer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filter !== "all") {
      deals = deals.filter((deal) => deal.status === filter);
    }

    // Sort
    deals.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "amount-high":
          return parseInt(b.amount) - parseInt(a.amount);
        case "amount-low":
          return parseInt(a.amount) - parseInt(b.amount);
        default:
          return 0;
      }
    });

    return deals;
  }, [initialDeals, searchQuery, filter, sortBy]);

  const statusMap = {
    0: "created" as const,
    1: "locked" as const,
    2: "completed" as const,
    3: "cancelled" as const,
  };

  const transformedDeals = filteredDeals.map((deal) => ({
    id: deal.id,
    seller: deal.seller,
    buyer: deal.buyer || undefined,
    amount: parseInt(deal.amount),
    status: statusMap[deal.status as keyof typeof statusMap] || "created",
    createdAt: new Date(deal.createdAt),
    updatedAt: new Date(deal.createdAt),
  }));

  return (
    <main className="min-h-screen bg-slate-950 p-8 pt-24">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">
            Danh Sách Giao Dịch
          </h1>
          <p className="text-slate-400 mt-2">
            Khám phá {filteredDeals.length} giao dịch trên blockchain
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-700 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Tìm kiếm theo ID giao dịch hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-slate-700 pl-10"
              />
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Tabs
                  value={filter === "all" ? "all" : filter.toString()}
                  onValueChange={(v) =>
                    setFilter(v === "all" ? "all" : parseInt(v))
                  }
                >
                  <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="0">Mới tạo</TabsTrigger>
                    <TabsTrigger value="1">Đang khóa</TabsTrigger>
                    <TabsTrigger value="2">Hoàn thành</TabsTrigger>
                    <TabsTrigger value="3">Đã hủy</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Select
                value={sortBy}
                onValueChange={(v: typeof sortBy) => setSortBy(v)}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="amount-high">Số tiền cao</SelectItem>
                  <SelectItem value="amount-low">Số tiền thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <DealList deals={transformedDeals} />
      </div>
    </main>
  );
}

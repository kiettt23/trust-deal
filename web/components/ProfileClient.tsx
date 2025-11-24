"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ParsedDeal } from "@/lib/sui-client";
import { formatSuiAmount, getStatusLabel } from "@/lib/sui-client";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ProfileClientProps {
  userDeals: ParsedDeal[];
  userStats: {
    address: string;
    dealsCreated: number;
    dealsCompleted: number;
    successRate: number;
    rating: number;
    totalVolume: bigint;
    trustScore: number;
    joinedAt: string;
  };
}

export function ProfileClient({ userDeals, userStats }: ProfileClientProps) {
  const { truncateAddress } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(userStats.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 pt-24">
      <div className="container mx-auto max-w-4xl space-y-8">
        <Card className="bg-linear-to-r from-blue-950 to-slate-900 border-blue-800 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-blue-500">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userStats.address}`}
                    />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                      {userStats.address.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-50">
                      {truncateAddress(userStats.address)}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={copyAddress}
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy Address
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <Star className="h-3 w-3 mr-1" />
                    {userStats.rating} Rating
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <Award className="h-3 w-3 mr-1" />
                    {userStats.trustScore} Trust Score
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400 flex items-center justify-end gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(userStats.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatsCard
            title="Deals Created"
            value={userStats.dealsCreated.toString()}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={12}
          />
          <StatsCard
            title="Deals Completed"
            value={userStats.dealsCompleted.toString()}
            icon={<Award className="h-4 w-4" />}
            trend={8}
          />
          <StatsCard
            title="Trust Score"
            value={userStats.trustScore.toString()}
            icon={<Shield className="h-4 w-4" />}
            trend={5}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700 shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-50 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Success Rate</span>
                        <span className="text-slate-50 font-medium">
                          {userStats.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={userStats.successRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Total Volume</p>
                        <p className="text-lg font-bold text-slate-50">
                          {formatSuiAmount(
                            Number(userStats.totalVolume)
                          ).toFixed(2)}{" "}
                          SUI
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Total Deals</p>
                        <p className="text-lg font-bold text-slate-50">
                          {userDeals.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-slate-900 border-slate-700 shadow-xl">
              <CardContent className="p-6">
                <p className="text-center text-slate-400 py-8">
                  Review system coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-900 border-slate-700 shadow-xl">
              <CardContent className="p-6">
                <Table>
                  <TableCaption>Your transaction history</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDeals.slice(0, 10).map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-mono text-xs">
                          {truncateAddress(deal.id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getStatusLabel(deal.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatSuiAmount(parseInt(deal.amount))} SUI
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-400">
                          {formatDistanceToNow(new Date(deal.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

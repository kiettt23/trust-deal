"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEscrow } from "@/hooks/useEscrow";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Escrow Aman",
    description: "Tiền được khóa tự động trên blockchain cho đến khi hoàn tất",
  },
  {
    icon: Zap,
    title: "Nhanh Chóng",
    description: "Giao dịch hoàn tất trong vài phút, không cần trung gian",
  },
  {
    icon: Users,
    title: "P2P Decentralized",
    description:
      "Giao dịch trực tiếp người-người-người, hoàn toàn phi tập trung",
  },
  {
    icon: Lock,
    title: "Bảo mật Cao",
    description: "Sử dụng công nghệ Sui blockchain, không ai có thể xâm phạm",
  },
  {
    icon: TrendingUp,
    title: "Sharedable",
    description: "Chia sẻ hợp đồng, tiểu sử, rating của bạn với bất kỳ ai",
  },
  {
    icon: CheckCircle,
    title: "Xác minh",
    description:
      "Profile được xác minh qua rating hệ thống & lịch sử giao dịch",
  },
];

export default function Home() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { createDeal } = useEscrow();

  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!price) return;
    setLoading(true);
    // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
    const amountInMist = Math.floor(Number(price) * 1_000_000_000);
    createDeal(amountInMist, (dealId) => {
      setLoading(false);

      // Save deal ID to localStorage for listing
      const storedIds = localStorage.getItem("deal_ids");
      const dealIds = storedIds ? JSON.parse(storedIds) : [];
      if (!dealIds.includes(dealId)) {
        dealIds.push(dealId);
        localStorage.setItem("deal_ids", JSON.stringify(dealIds));
      }

      router.push(`/deal/${dealId}`);
    });
  };

  return (
    <main className="min-h-screen text-slate-100">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center p-8 pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        {/* Bottom gradient separator - tối ở rìa, nhạt dần vào giữa */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

        <div className="w-full max-w-2xl space-y-12 text-center">
          {/* Badge */}
          <Badge className="mx-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
            🚀 The Future of Escrow is Here
          </Badge>

          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Giao Dịch An Toàn
              <br />
              Không Rủi Ro
            </h1>
            <p className="text-xl text-slate-400">
              TrustDeal - Nền tảng escrow P2P trên Sui Blockchain. Giao dịch an
              toàn, nhanh chóng, hoàn toàn phi tập trung.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/deals">
              <Button
                size="lg"
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Khám Phá Giao Dịch
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                Xem Analytics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">1,234+</p>
              <p className="text-xs text-slate-400 mt-1">Giao dịch</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">$2.5M+</p>
              <p className="text-xs text-slate-400 mt-1">Khối lượng</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">98%</p>
              <p className="text-xs text-slate-400 mt-1">Thành công</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Create Deal Section - Nổi bật với lighter background */}
      <section className="relative py-16 px-8 bg-slate-900/70 border-y border-slate-700/50">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/10 via-transparent to-purple-950/10 pointer-events-none" />

        <div className="container mx-auto max-w-md relative z-10">
          <Card className="bg-slate-900 border-slate-700 shadow-xl shadow-blue-900/10">
            <CardHeader>
              <CardTitle>Tạo Giao Dịch Mới</CardTitle>
              <CardDescription>
                {account
                  ? "Nhập số tiền bạn muốn bán (Đơn vị: SUI)"
                  : "Vui lòng kết nối ví để tạo giao dịch"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!account ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">
                    Bạn cần kết nối Sui Wallet để tạo giao dịch
                  </p>
                  <p className="text-sm text-slate-500">
                    👆 Nhấn nút Connect Wallet ở trên
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá trị (SUI)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Ví dụ: 10.5"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="bg-slate-800 border-slate-700"
                    />
                    <p className="text-xs text-slate-500">
                      Số tiền sẽ được khóa trong smart contract escrow
                    </p>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreate}
                    disabled={loading || !price}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Đang khởi tạo...</span>
                      </div>
                    ) : (
                      "Tạo Smart Contract"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section - Dark background with subtle pattern */}
      <section className="py-20 px-8 bg-slate-950 border-y border-slate-800 relative">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-50">
              Tại Sao Chọn TrustDeal?
            </h2>
            <p className="text-lg text-slate-400">
              Các tính năng vượt trội cho giao dịch an toàn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="bg-slate-900 border-slate-700 shadow-xl hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-blue-900/10"
                >
                  <CardHeader>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient background */}
      <section className="py-20 px-8 bg-linear-to-br from-blue-950 via-slate-900 to-purple-950 border-y border-slate-800 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="container mx-auto max-w-2xl text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-50">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-slate-400">
              Tham gia cộng đồng TrustDeal ngay hôm nay
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!account ? (
              <p className="text-slate-400">Vui lòng kết nối ví để bắt đầu</p>
            ) : (
              <>
                <Link href="/deals">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Duyệt Giao Dịch
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-800"
                  >
                    Xem Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer - Darkest section */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-50 mb-4">TrustDeal</h3>
              <p className="text-sm text-slate-400">
                Nền tảng escrow P2P an toàn trên Sui Blockchain
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/deals" className="hover:text-slate-200">
                    Giao Dịch
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-slate-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-slate-200">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-200">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-200">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 TrustDeal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

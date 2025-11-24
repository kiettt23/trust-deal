# TrustDeal - Decentralized Escrow Platform 🤝

TrustDeal là nền tảng giao dịch đảm bảo P2P trên mạng Sui Blockchain, giúp loại bỏ rủi ro lừa đảo (scam) khi giao dịch tài sản số.

## 🏗 Kiến trúc (Architecture)

- **Smart Contract:** Sui Move (Quản lý trạng thái tiền, khóa tiền, hoàn tiền)
- **Frontend:** Next.js 16 + Tailwind CSS + Radix UI
- **Wallet Integration:** Slush Wallet

## 🚀 Cách chạy dự án (How to run)

### 1. Move Contract (Backend)

cd move/trustdeal
sui move build
sui client publish --gas-budget 100000000

### 2. Web Interface (Frontend)

cd web
npm install
npm run dev

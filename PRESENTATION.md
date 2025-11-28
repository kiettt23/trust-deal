# 🎯 TrustDeal - Thuyết Trình Dự Án

> **Nền tảng Escrow phi tập trung trên Sui Blockchain**

---

## 📋 Mục Lục

1. [Giới thiệu & Vấn đề](#1-giới-thiệu--vấn-đề)
2. [Giải pháp TrustDeal](#2-giải-pháp-trustdeal)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Smart Contract](#4-smart-contract)
5. [Luồng hoạt động](#5-luồng-hoạt-động)
6. [Tech Stack](#6-tech-stack)
7. [Demo Features](#7-demo-features)
8. [Roadmap & Tương lai](#8-roadmap--tương-lai)
9. [Kết luận](#9-kết-luận)

---

## 1. Giới thiệu & Vấn đề

### 🔴 Vấn đề thực tế

Trong giao dịch P2P (Person-to-Person), cả người mua và người bán đều gặp rủi ro:

| Góc nhìn      | Rủi ro                                                |
| ------------- | ----------------------------------------------------- |
| **Người mua** | Chuyển tiền trước → Không nhận được hàng → Mất tiền   |
| **Người bán** | Giao hàng trước → Không nhận được tiền → Mất hàng     |
| **Cả hai**    | Không có bên thứ 3 đáng tin cậy để phân xử tranh chấp |

### 📊 Thống kê thực tế

- **$5.8 tỷ USD** - Thiệt hại do lừa đảo online năm 2023 (FTC)
- **70%** - Người dùng lo ngại khi giao dịch với người lạ
- **Hàng triệu** - Giao dịch P2P thất bại do thiếu niềm tin

### 🤔 Tại sao giải pháp hiện tại chưa đủ?

| Giải pháp               | Nhược điểm                                  |
| ----------------------- | ------------------------------------------- |
| **PayPal/Shopee**       | Phí cao (3-15%), giới hạn quốc gia, cần KYC |
| **Escrow truyền thống** | Phí rất cao, chậm, cần nhiều thủ tục        |
| **Trung gian cá nhân**  | Không đáng tin, có thể là scammer           |
| **Giao dịch trực tiếp** | Rủi ro an toàn, giới hạn địa lý             |

---

## 2. Giải pháp TrustDeal

### 💡 Ý tưởng cốt lõi

> **"Dùng Smart Contract làm trung gian tự động, thay thế con người"**

TrustDeal sử dụng **Escrow Smart Contract** trên Sui Blockchain để:

1. ✅ **Tự động giữ tiền** - Tiền được khóa trong contract, không ai có thể rút trộm
2. ✅ **Tự động giải ngân** - Khi người mua xác nhận nhận hàng → Tiền tự động chuyển cho người bán
3. ✅ **Tự động hoàn tiền** - Nếu hủy deal → Tiền tự động trả về cho người mua
4. ✅ **Minh bạch 100%** - Mọi giao dịch đều được ghi trên blockchain, ai cũng có thể kiểm tra

### 🎯 Giá trị mang lại

| Cho Người dùng                       | Cho Thị trường                     |
| ------------------------------------ | ---------------------------------- |
| Giao dịch an toàn, không lo mất tiền | Tăng niềm tin trong P2P trading    |
| Không phí ẩn, phí thấp               | Mở rộng thị trường xuyên biên giới |
| Nhanh chóng, không cần KYC           | Giảm lừa đảo, tăng adoption crypto |
| Hoạt động 24/7, tự động              | Thúc đẩy DeFi ecosystem            |

---

## 3. Kiến trúc hệ thống

### 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Next.js   │  │   React 19  │  │   @mysten/dapp-kit      │  │
│  │   App 16    │  │   + Hooks   │  │   (Wallet Integration)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  shadcn/ui  │  │ TailwindCSS │  │   TanStack Query        │  │
│  │  Components │  │     4.0     │  │   (State Management)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUI BLOCKCHAIN                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 ESCROW SMART CONTRACT                    │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐    │    │
│  │  │  create   │  │  deposit  │  │  confirm_delivery │    │    │
│  │  │  _deal    │  │           │  │                   │    │    │
│  │  └───────────┘  └───────────┘  └───────────────────┘    │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │                cancel_deal                     │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Shared Deal │  │   Balance   │  │   On-chain Events       │  │
│  │   Objects   │  │   Storage   │  │   (Transaction Log)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 🔗 Data Flow

```
Người bán                    Smart Contract                 Người mua
    │                              │                             │
    │ 1. create_deal(price)        │                             │
    │ ─────────────────────────────>                             │
    │                              │                             │
    │            Deal Object Created (status: CREATED)           │
    │                              │                             │
    │                              │    2. deposit(payment)      │
    │                              │ <───────────────────────────
    │                              │                             │
    │           SUI locked in contract (status: LOCKED)          │
    │                              │                             │
    │   [Người bán giao hàng ngoài blockchain]                   │
    │                              │                             │
    │                              │  3. confirm_delivery()      │
    │                              │ <───────────────────────────
    │                              │                             │
    │    SUI transferred to Seller (status: COMPLETED)           │
    │ <─────────────────────────────                             │
```

---

## 4. Smart Contract

### 📜 Escrow Contract (Move Language)

```move
module trustdeal::escrow {
    // --- TRẠNG THÁI DEAL ---
    const STATUS_CREATED: u8 = 0;    // Mới tạo, chờ người mua
    const STATUS_LOCKED: u8 = 1;     // Đã có tiền, chờ giao hàng
    const STATUS_COMPLETED: u8 = 2;  // Hoàn thành
    const STATUS_CANCELLED: u8 = 3;  // Đã hủy

    // --- CẤU TRÚC DEAL ---
    public struct Deal has key, store {
        id: UID,                        // ID duy nhất
        seller: address,                // Địa chỉ người bán
        buyer: Option<address>,         // Địa chỉ người mua (optional)
        amount: u64,                    // Số tiền yêu cầu
        status: u8,                     // Trạng thái hiện tại
        escrowed_balance: Balance<SUI>, // Tiền đang giữ
    }
}
```

### 🔐 Các hàm chính

| Hàm                  | Người gọi    | Mô tả                                       |
| -------------------- | ------------ | ------------------------------------------- |
| `create_deal(price)` | Seller       | Tạo deal mới với giá yêu cầu                |
| `deposit(payment)`   | Buyer        | Nạp tiền vào escrow                         |
| `confirm_delivery()` | Buyer        | Xác nhận nhận hàng → Chuyển tiền cho Seller |
| `cancel_deal()`      | Seller/Buyer | Hủy deal → Hoàn tiền nếu có                 |

### 🛡️ Bảo mật

1. **Access Control** - Chỉ đúng người mới được thực hiện hành động
2. **State Machine** - Trạng thái phải đúng thứ tự, không thể skip
3. **Balance Safety** - Move language đảm bảo không thể tạo/hủy tiền từ hư không
4. **Immutable Logic** - Code contract không thể bị sửa sau khi deploy

---

## 5. Luồng hoạt động

### 🔄 Happy Path (Giao dịch thành công)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌───────┐ │
│  │ CREATE  │───>│ DEPOSIT │───>│ DELIVER │───>│ CONFIRM │───>│ DONE  │ │
│  │  DEAL   │    │  (Lock) │    │  (Off)  │    │         │    │       │ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └───────┘ │
│     Seller        Buyer         Seller          Buyer        Both Win  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Chi tiết từng bước:**

| Bước | Hành động                           | Kết quả                              |
| ---- | ----------------------------------- | ------------------------------------ |
| 1️⃣   | Seller tạo deal (VD: 10 SUI)        | Deal object được tạo trên blockchain |
| 2️⃣   | Buyer tìm thấy deal, nạp 10 SUI     | SUI bị khóa trong contract           |
| 3️⃣   | Seller giao hàng (ngoài blockchain) | Thỏa thuận riêng giữa 2 bên          |
| 4️⃣   | Buyer nhận hàng, nhấn Confirm       | 10 SUI chuyển tự động cho Seller     |
| ✅   | Giao dịch hoàn tất                  | Cả 2 bên happy!                      |

### ❌ Unhappy Path (Hủy giao dịch)

```
Trường hợp 1: Hủy trước khi có người mua
┌─────────┐    ┌─────────┐
│ CREATE  │───>│ CANCEL  │  → Không có tiền, chỉ đổi status
│  DEAL   │    │         │
└─────────┘    └─────────┘

Trường hợp 2: Hủy sau khi đã lock tiền
┌─────────┐    ┌─────────┐    ┌─────────┐
│ DEPOSIT │───>│ CANCEL  │───>│ REFUND  │  → Tiền tự động trả về Buyer
│  (Lock) │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘
```

---

## 6. Tech Stack

### 🎨 Frontend

| Công nghệ          | Phiên bản   | Lý do chọn                         |
| ------------------ | ----------- | ---------------------------------- |
| **Next.js**        | 16 (canary) | App Router, Server Components, RSC |
| **React**          | 19          | Hooks, Concurrent Mode, use() hook |
| **TypeScript**     | 5.0         | Type safety, better DX             |
| **Tailwind CSS**   | 4.0         | Utility-first, JIT compiler        |
| **shadcn/ui**      | Latest      | Beautiful, accessible components   |
| **TanStack Query** | 5           | Server state, caching, real-time   |
| **Lucide Icons**   | Latest      | Consistent, lightweight icons      |

### ⛓️ Blockchain

| Công nghệ            | Mục đích                               |
| -------------------- | -------------------------------------- |
| **Sui Blockchain**   | Layer 1, high throughput, low fees     |
| **Move Language**    | Smart contract, asset-oriented         |
| **@mysten/dapp-kit** | Wallet connection, transaction signing |
| **@mysten/sui**      | Sui SDK for JavaScript                 |

### 🚀 Tại sao chọn Sui?

| Đặc điểm         | Sui         | Ethereum      | Solana        |
| ---------------- | ----------- | ------------- | ------------- |
| **TPS**          | 100,000+    | ~15           | ~65,000       |
| **Finality**     | ~400ms      | ~12s          | ~400ms        |
| **Gas Fee**      | $0.001      | $5-50         | $0.00025      |
| **Language**     | Move (Safe) | Solidity      | Rust          |
| **Object Model** | Native      | Account-based | Account-based |

---

## 7. Demo Features

### 📱 Các màn hình chính

#### 1️⃣ Homepage

- Hero section với value proposition
- Animated illustrations
- Quick start guide
- Call-to-action buttons

#### 2️⃣ Dashboard

- Thống kê tổng quan (Total Deals, Volume, Success Rate)
- Biểu đồ real-time với Recharts
- Recent deals list
- Trust Score display

#### 3️⃣ Deals Page

- Grid view tất cả deals
- Filter by status
- Pagination
- Quick actions

#### 4️⃣ Deal Detail

- Timeline với trạng thái
- Action buttons (Deposit/Confirm/Cancel)
- Real-time updates với polling
- Transaction history

#### 5️⃣ Profile

- User stats
- Deal history
- Trust Score breakdown
- Wallet info

### ✨ UX Features

| Feature                 | Mô tả                                   |
| ----------------------- | --------------------------------------- |
| **Wallet Connect**      | One-click connect với Sui Wallet        |
| **Real-time Updates**   | Auto-refresh deal status mỗi 3s         |
| **Confetti Animation**  | Celebration khi hoàn thành deal         |
| **Toast Notifications** | Feedback tức thì cho mọi action         |
| **Responsive Design**   | Mobile-first, hoạt động trên mọi device |
| **Loading States**      | Skeleton loaders, spinners              |
| **Error Handling**      | Friendly error messages                 |

---

## 8. Roadmap & Tương lai

### 🗓️ Phase 1: MVP (Hiện tại) ✅

- [x] Smart Contract Escrow cơ bản
- [x] Create/Deposit/Confirm/Cancel flows
- [x] Wallet integration
- [x] Responsive UI
- [x] Real-time updates

### 🗓️ Phase 2: Enhancement (Q1 2025)

- [ ] **Dispute Resolution** - Hệ thống tranh chấp với arbitrator
- [ ] **Multi-token Support** - Hỗ trợ nhiều loại token
- [ ] **Reputation System** - On-chain trust scores
- [ ] **GraphQL Indexer** - Query nhanh hơn với Sui Indexer

### 🗓️ Phase 3: Scale (Q2 2025)

- [ ] **Multi-sig Escrow** - Nhiều bên tham gia (N-of-M)
- [ ] **Time-locked Deals** - Tự động release theo thời gian
- [ ] **NFT Escrow** - Hỗ trợ giao dịch NFT
- [ ] **Mobile App** - React Native app

### 🗓️ Phase 4: Ecosystem (Q3 2025)

- [ ] **API for Merchants** - Integration cho e-commerce
- [ ] **Fiat On-ramp** - Mua crypto trực tiếp
- [ ] **Cross-chain** - Bridge sang các chain khác
- [ ] **DAO Governance** - Community-driven development

---

## 9. Kết luận

### 🎯 Tóm tắt

TrustDeal giải quyết vấn đề **niềm tin trong giao dịch P2P** bằng cách:

1. **Dùng Smart Contract thay thế con người** - Không thiên vị, không lừa đảo
2. **Tự động hóa hoàn toàn** - Không cần chờ đợi, xử lý tức thì
3. **Minh bạch 100%** - Mọi thứ được ghi nhận trên blockchain
4. **Chi phí thấp** - Gas fee trên Sui chỉ ~$0.001/giao dịch

### 💪 Điểm mạnh

| Aspect        | Điểm mạnh                             |
| ------------- | ------------------------------------- |
| **Technical** | Modern stack, type-safe, scalable     |
| **UX**        | Beautiful UI, responsive, real-time   |
| **Security**  | Move language, battle-tested patterns |
| **Business**  | Clear problem-solution, large market  |

### 🚀 Call to Action

> **"Hãy thử TrustDeal ngay hôm nay và trải nghiệm giao dịch P2P an toàn!"**

- 🌐 **Live Demo**: [trust-deal.vercel.app](https://trust-deal.vercel.app)
- 📦 **GitHub**: [github.com/kiettt23/trust-deal](https://github.com/kiettt23/trust-deal)
- 📧 **Contact**: [Your Email]

---

## 📎 Phụ lục

### A. Cách chạy dự án

```bash
# Clone repo
git clone https://github.com/kiettt23/trust-deal.git

# Install dependencies
cd trust-deal/web
npm install

# Start development server
npm run dev

# Truy cập http://localhost:3000
```

### B. Cấu trúc thư mục

```
trust-deal/
├── move/                    # Smart Contract
│   ├── sources/
│   │   └── escrow.move     # Main contract
│   └── Move.toml           # Dependencies
│
└── web/                     # Frontend
    ├── app/                 # Next.js App Router
    │   ├── dashboard/       # Dashboard page
    │   ├── deals/           # Deals listing
    │   ├── deal/[id]/       # Deal detail
    │   └── profile/         # User profile
    ├── components/          # React components
    ├── hooks/               # Custom hooks
    ├── lib/                 # Utilities
    └── contracts/           # Contract config
```

### C. Environment Variables

```env
NEXT_PUBLIC_PACKAGE_ID=0x...      # Deployed contract address
NEXT_PUBLIC_SUI_NETWORK=testnet   # Network: testnet/mainnet
```

---

**© 2024 TrustDeal - Built with ❤️ on Sui Blockchain**

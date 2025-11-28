# 📋 Manual Testing Checklist - TrustDeal

## Môi trường test

- [ ] Browser: Chrome/Firefox
- [ ] Network: Sui Testnet
- [ ] Wallet: Sui Wallet extension đã cài đặt
- [ ] Có SUI testnet trong ví (faucet: https://faucet.testnet.sui.io/)

---

## 1. 🔌 Kết nối Wallet

### Test 1.1: Connect Wallet

- [ ] Mở trang chủ
- [ ] Click "Kết nối ví"
- [ ] Popup Sui Wallet hiện lên
- [ ] Approve connection
- [ ] **Expected:** Hiển thị địa chỉ ví (shortened) trên header

### Test 1.2: Disconnect Wallet

- [ ] Click vào địa chỉ ví trên header
- [ ] Click "Disconnect"
- [ ] **Expected:** Quay về trạng thái chưa kết nối

---

## 2. ➕ Tạo Deal (Seller Flow)

### Test 2.1: Tạo Deal thành công

- [ ] Kết nối wallet
- [ ] Click "Tạo Deal mới"
- [ ] Nhập thông tin:
  - Tên sản phẩm: "iPhone 15 Pro Max"
  - Mô tả: "Mới 100%, fullbox"
  - Giá: 1 (SUI)
- [ ] Click "Tạo Deal"
- [ ] Approve transaction trong wallet
- [ ] **Expected:**
  - Toast thành công
  - Redirect đến trang deal detail
  - Status = "Đang chờ người mua" (màu xanh dương)

### Test 2.2: Tạo Deal với giá = 0

- [ ] Thử tạo deal với giá = 0
- [ ] **Expected:** Hiển thị lỗi validation, không cho submit

### Test 2.3: Tạo Deal không có wallet

- [ ] Disconnect wallet
- [ ] Vào trang tạo deal
- [ ] **Expected:** Yêu cầu kết nối wallet hoặc disable form

---

## 3. 💸 Deposit (Buyer Flow)

### Test 3.1: Deposit thành công

- [ ] Dùng wallet KHÁC (không phải seller)
- [ ] Mở deal đang ở status CREATED (0)
- [ ] Click "Nạp X SUI để khóa kèo"
- [ ] Approve transaction
- [ ] **Expected:**
  - Toast thành công
  - Status đổi thành "Đã khóa" (màu vàng)
  - Hiển thị địa chỉ buyer

### Test 3.2: Seller tự deposit

- [ ] Dùng wallet của seller (người tạo deal)
- [ ] Mở deal do mình tạo
- [ ] Click nút Deposit
- [ ] **Expected:** Transaction có thể thành công (contract cho phép), nhưng không hợp lý về business

### Test 3.3: Deposit deal đã LOCKED

- [ ] Mở deal đang ở status LOCKED (1)
- [ ] **Expected:** Không hiển thị nút Deposit

---

## 4. ✅ Confirm Delivery (Buyer Flow)

### Test 4.1: Confirm thành công

- [ ] Dùng wallet của BUYER
- [ ] Mở deal đang ở status LOCKED (1)
- [ ] Click "Đã nhận hàng (Release Funds)"
- [ ] Approve transaction
- [ ] **Expected:**
  - Toast thành công
  - Status đổi thành "Hoàn thành" (màu xanh lá)
  - Animation confetti (nếu có)
  - Tiền được chuyển cho seller

### Test 4.2: Seller confirm (không phải buyer)

- [ ] Dùng wallet của SELLER
- [ ] Mở deal đang ở status LOCKED (1)
- [ ] **Expected:** Nút Confirm bị disabled, có ghi chú "Chỉ Buyer mới có quyền xác nhận"

---

## 5. 🚫 Cancel Deal

### Test 5.1: Seller cancel khi CREATED (thành công)

- [ ] Dùng wallet của SELLER
- [ ] Mở deal do mình tạo, status = CREATED (0)
- [ ] Click "Hủy kèo"
- [ ] Xác nhận popup
- [ ] Approve transaction
- [ ] **Expected:**
  - Toast thành công
  - Status = CANCELLED (màu đỏ)
  - Ghi chú: "Deal chưa có người mua - có thể hủy tự do"

### Test 5.2: Cancel khi LOCKED (hoàn tiền)

- [ ] Mở deal đang ở status LOCKED (1)
- [ ] Seller HOẶC Buyer click "Hủy kèo & Hoàn tiền cho Buyer"
- [ ] Xác nhận popup cảnh báo
- [ ] Approve transaction
- [ ] **Expected:**
  - Toast thành công
  - Status = CANCELLED (màu đỏ)
  - Tiền hoàn lại cho Buyer
  - Ghi chú: "Nếu hủy, tiền sẽ được hoàn lại cho Buyer"

### Test 5.3: Random user cancel (phải fail)

- [ ] Dùng wallet KHÔNG PHẢI seller hoặc buyer
- [ ] Mở deal status CREATED hoặc LOCKED
- [ ] **Expected:** Không hiển thị nút Cancel

---

## 6. 📊 Dashboard

### Test 6.1: Hiển thị deals

- [ ] Kết nối wallet
- [ ] Vào trang Dashboard
- [ ] **Expected:** Hiển thị danh sách deals liên quan đến user

### Test 6.2: Filter theo status

- [ ] Click các tab filter (Tất cả, Đang chờ, Đã khóa, Hoàn thành)
- [ ] **Expected:** Danh sách filter đúng theo status

### Test 6.3: Statistics

- [ ] Kiểm tra số liệu thống kê (tổng deals, tổng volume, etc.)
- [ ] **Expected:** Số liệu tương đối khớp với danh sách deals

---

## 7. 👤 Profile

### Test 7.1: Hiển thị profile

- [ ] Kết nối wallet
- [ ] Vào trang Profile
- [ ] **Expected:** Hiển thị địa chỉ ví, thống kê cá nhân

---

## 8. 🔄 Real-time Updates

### Test 8.1: Real-time Indicator hiển thị

- [ ] Mở trang deal detail
- [ ] **Expected:** Có hiển thị indicator "Live" màu xanh lá bên cạnh tiêu đề

### Test 8.2: Auto-update khi có thay đổi

- [ ] Mở deal đang ở status CREATED trên 2 browser/tab khác nhau
- [ ] Từ tab 1 (Buyer): Thực hiện Deposit
- [ ] **Expected trên tab 2 (Seller):**
  - Hiện notification "Deal đã được cập nhật!"
  - Status tự động đổi thành LOCKED
  - Không cần refresh page

### Test 8.3: Confirm tự động cập nhật

- [ ] Mở deal LOCKED trên 2 tab
- [ ] Tab 1 (Buyer): Click Confirm
- [ ] **Expected trên tab 2:** Status tự động đổi thành COMPLETED

---

## 9. ⚠️ Edge Cases

### Test 9.1: Network error

- [ ] Tắt internet
- [ ] Thử thực hiện transaction
- [ ] **Expected:** Hiển thị lỗi network, không crash app

### Test 9.2: Insufficient balance

- [ ] Dùng wallet có ít SUI hơn giá deal
- [ ] Thử deposit
- [ ] **Expected:** Wallet báo lỗi insufficient funds

### Test 9.3: Page refresh

- [ ] Đang ở trang deal detail
- [ ] Refresh page (F5)
- [ ] **Expected:** Data vẫn hiển thị đúng

### Test 9.4: Invalid deal ID

- [ ] Truy cập URL với deal ID không tồn tại
- [ ] **Expected:** Hiển thị "Không tìm thấy Deal này!"

---

## 10. 📱 UI/UX Check

### Test 10.1: Responsive

- [ ] Mở DevTools (F12)
- [ ] Chuyển sang mobile view (375px, 768px)
- [ ] **Expected:** UI hiển thị tốt, không bị vỡ layout

### Test 10.2: Loading states

- [ ] Khi mở trang deal detail
- [ ] **Expected:** Hiển thị skeleton loading đẹp

### Test 10.3: Error messages

- [ ] Khi transaction fail
- [ ] **Expected:** Toast error với message rõ ràng

### Test 10.4: Copy buttons

- [ ] Click copy Deal Link
- [ ] Click copy địa chỉ Seller/Buyer
- [ ] **Expected:** Copy thành công, hiện toast xác nhận

---

## 📝 Kết quả Test

| #    | Test Case               | Pass | Fail | Notes |
| ---- | ----------------------- | ---- | ---- | ----- |
| 1.1  | Connect Wallet          |      |      |       |
| 1.2  | Disconnect Wallet       |      |      |       |
| 2.1  | Tạo Deal thành công     |      |      |       |
| 2.2  | Tạo Deal giá = 0        |      |      |       |
| 2.3  | Tạo Deal không wallet   |      |      |       |
| 3.1  | Deposit thành công      |      |      |       |
| 3.2  | Seller tự deposit       |      |      |       |
| 3.3  | Deposit deal LOCKED     |      |      |       |
| 4.1  | Confirm thành công      |      |      |       |
| 4.2  | Seller confirm          |      |      |       |
| 5.1  | Cancel CREATED          |      |      |       |
| 5.2  | Cancel LOCKED           |      |      |       |
| 5.3  | Random user cancel      |      |      |       |
| 6.1  | Dashboard hiển thị      |      |      |       |
| 6.2  | Filter status           |      |      |       |
| 6.3  | Statistics              |      |      |       |
| 7.1  | Profile hiển thị        |      |      |       |
| 8.1  | Real-time indicator     |      |      |       |
| 8.2  | Auto-update khi deposit |      |      |       |
| 8.3  | Auto-update khi confirm |      |      |       |
| 9.1  | Network error           |      |      |       |
| 9.2  | Insufficient balance    |      |      |       |
| 9.3  | Page refresh            |      |      |       |
| 9.4  | Invalid deal ID         |      |      |       |
| 10.1 | Responsive              |      |      |       |
| 10.2 | Loading states          |      |      |       |
| 10.3 | Error messages          |      |      |       |
| 10.4 | Copy buttons            |      |      |       |

---

## 🎬 Demo Script (5-7 phút)

### Chuẩn bị trước demo

1. Có 2 wallets với SUI testnet
2. Tạo sẵn 2-3 deals ở các status khác nhau (CREATED, LOCKED, COMPLETED)
3. Mở sẵn các tab browser

### Flow demo

**1. Giới thiệu (1 phút)**

- TrustDeal là nền tảng escrow phi tập trung trên Sui
- Giải quyết vấn đề: giao dịch P2P không tin tưởng nhau

**2. Demo Seller tạo deal (2 phút)**

- Kết nối ví Seller
- Tạo deal mới: "MacBook Pro M3" - 5 SUI
- Giải thích: Deal được tạo trên blockchain, status = CREATED
- Copy link deal để gửi cho Buyer

**3. Demo Buyer deposit (2 phút)**

- Mở tab mới, kết nối ví Buyer
- Paste link deal
- Click Deposit → tiền bị lock trong smart contract
- Giải thích: Không ai động được tiền, kể cả seller

**4. Demo Confirm delivery (1 phút)**

- Buyer click "Đã nhận hàng"
- Tiền tự động chuyển cho Seller
- Status = COMPLETED

**5. Kết luận (1 phút)**

- An toàn: tiền lock trong contract
- Trustless: không cần bên trung gian
- Roadmap: dispute resolution, rating system

### Backup plan

- Nếu transaction chậm: Chuyển sang deal đã tạo sẵn
- Nếu lỗi: "Đây là testnet, mainnet sẽ ổn định hơn"

---

## 🐛 Known Issues

| Issue                                      | Status  | Workaround                       |
| ------------------------------------------ | ------- | -------------------------------- |
| Seller có thể tự deposit vào deal của mình | Known   | Không ảnh hưởng security, chỉ UX |
| LocalStorage mất khi xóa cache             | Known   | Sẽ upgrade lên Sui Indexer       |
| Không có dispute resolution                | Planned | Phase 2 development              |

---

## ✅ Checklist trước Demo

- [ ] Đã test full flow ít nhất 1 lần
- [ ] Có đủ SUI testnet trong cả 2 ví
- [ ] Có deals sẵn ở các status khác nhau
- [ ] Internet ổn định
- [ ] Browser đã clear cache cũ (tránh conflict)
- [ ] Đã đọc qua demo script

# 🧪 TrustDeal - Test Cases

## Test Environment Setup

### Prerequisites

- ✅ Sui Wallet extension installed
- ✅ Connected to Devnet
- ✅ Have some devnet SUI tokens (get from [Sui Devnet Faucet](https://discord.com/channels/916379725201563759/971488439931392130))
- ✅ Browser with localStorage enabled

### Quick Setup

```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📋 Test Case 1: Homepage & Navigation

### Test 1.1: Homepage Loading

**Steps:**

1. Navigate to `http://localhost:3000`
2. Verify page loads without errors

**Expected Result:**

- ✅ Hero section displays with gradient title
- ✅ Stats cards show: "1,234+ Giao dịch", "$2.5M+ Khối lượng", "98% Thành công"
- ✅ Features section with 6 cards
- ✅ Create Deal form is visible
- ✅ No console errors

### Test 1.2: Navbar Functionality

**Steps:**

1. Check navbar elements
2. Click on each navigation link
3. Test on mobile (< 768px width)

**Expected Result:**

- ✅ Logo displays with blue/purple gradient shield icon
- ✅ "Giao Dịch", "Dashboard", "Profile" links are centered
- ✅ Connect Wallet button appears on right
- ✅ Mobile menu button shows on small screens
- ✅ All links navigate correctly

### Test 1.3: Wallet Connection

**Steps:**

1. Click "Connect Wallet" button
2. Select Sui Wallet from modal
3. Approve connection

**Expected Result:**

- ✅ Wallet modal opens
- ✅ Connected wallet address shows in navbar
- ✅ "Tạo Deal" button becomes visible
- ✅ Create Deal form becomes active

---

## 📋 Test Case 2: Create Deal Flow

### Test 2.1: Create Deal - Happy Path

**Steps:**

1. Ensure wallet is connected
2. Scroll to "Tạo Giao Dịch Mới" section
3. Enter amount: `5.0` SUI
4. Click "Tạo Smart Contract"
5. Approve transaction in wallet

**Expected Result:**

- ✅ Loading indicator shows "Đang khởi tạo..."
- ✅ Transaction submits to blockchain
- ✅ Success toast: "Khởi tạo thành công! Đang chuyển hướng..."
- ✅ Confetti animation plays 🎉
- ✅ Redirects to `/deal/[id]` page
- ✅ Deal ID saved to localStorage
- ✅ Console logs: "New Deal ID: 0x..."

### Test 2.2: Create Deal - Validation

**Steps:**

1. Try to create deal without wallet connected
2. Try with empty amount
3. Try with invalid amount (negative, text)

**Expected Result:**

- ✅ Message: "Vui lòng kết nối Sui Wallet để tạo giao dịch"
- ✅ Button disabled when amount is empty
- ✅ Input validates numeric values only

### Test 2.3: Create Deal - Error Handling

**Steps:**

1. Disconnect wallet mid-transaction
2. Reject transaction in wallet popup

**Expected Result:**

- ✅ Error toast shows: "Thất bại: [error message]"
- ✅ Button returns to normal state
- ✅ User can retry

---

## 📋 Test Case 3: Deal Detail Page

### Test 3.1: View Deal Details

**Steps:**

1. Create a new deal (follow Test 2.1)
2. Verify redirect to `/deal/[id]`
3. Check all displayed information

**Expected Result:**

- ✅ Card shows "Chi tiết Giao dịch"
- ✅ Status badge displays "Mới tạo" (blue)
- ✅ Amount shows in SUI (e.g., "5.00 SUI")
- ✅ Seller address matches your wallet
- ✅ Buyer shows "Chưa có người mua"
- ✅ Deal ID is copyable
- ✅ Timeline shows "Deal Created" step

### Test 3.2: Deposit (Buy) Flow

**Steps:**

1. Open deal detail page in DIFFERENT browser/wallet
2. Connect different wallet (buyer)
3. Click "Nạp Tiền & Khóa Deal"
4. Approve transaction

**Expected Result:**

- ✅ Transaction submits successfully
- ✅ Status changes to "Đang khóa" (yellow)
- ✅ Buyer address updates to your wallet
- ✅ Timeline shows "Buyer Deposited" step
- ✅ Button changes to "Xác Nhận Đã Nhận Hàng"

### Test 3.3: Confirm Delivery Flow

**Steps:**

1. As buyer, click "Xác Nhận Đã Nhận Hàng"
2. Approve transaction

**Expected Result:**

- ✅ Transaction completes
- ✅ Status changes to "Hoàn thành" (green)
- ✅ Seller receives payment
- ✅ Timeline shows "Deal Completed"
- ✅ No action buttons visible

### Test 3.4: Cancel Deal Flow

**Steps:**

1. Create new deal
2. As seller, click "Hủy Giao Dịch"
3. Approve transaction

**Expected Result:**

- ✅ Status changes to "Đã hủy" (red)
- ✅ Timeline shows "Deal Cancelled"
- ✅ No funds transferred

---

## 📋 Test Case 4: Deals List Page

### Test 4.1: View All Deals

**Steps:**

1. Create 2-3 deals
2. Navigate to `/deals`

**Expected Result:**

- ✅ Page title: "Danh Sách Giao Dịch"
- ✅ Shows count: "Khám phá X giao dịch trên blockchain"
- ✅ All created deals appear in grid
- ✅ Each card shows: ID, amount, seller, buyer, status

### Test 4.2: Search & Filter

**Steps:**

1. Use search box to search by deal ID
2. Filter by status tabs: "Tất cả", "Mới tạo", "Đang khóa", etc.
3. Sort by: "Mới nhất", "Cũ nhất", "Số tiền cao", "Số tiền thấp"

**Expected Result:**

- ✅ Search filters results in real-time
- ✅ Status tabs filter correctly
- ✅ Sorting works as expected
- ✅ "Không tìm thấy giao dịch nào" shows when empty

### Test 4.3: Deal Card Click

**Steps:**

1. Click "Xem chi tiết" on any deal card

**Expected Result:**

- ✅ Navigates to `/deal/[id]`
- ✅ Opens external link icon

---

## 📋 Test Case 5: Dashboard Page

### Test 5.1: Dashboard Loading

**Steps:**

1. Create at least 2 deals with different statuses
2. Navigate to `/dashboard`

**Expected Result:**

- ✅ Shows 4 stats cards with real data
- ✅ "Tổng Giao Dịch" shows correct count
- ✅ "Thành Công" shows completed deals
- ✅ "Khối Lượng" shows total volume in SUI
- ✅ Charts render without errors

### Test 5.2: Charts Display

**Steps:**

1. Verify all charts render
2. Hover over chart elements

**Expected Result:**

- ✅ Bar chart: "Khối Lượng Giao Dịch (7 Ngày)"
- ✅ Pie chart: "Trạng Thái Giao Dịch"
- ✅ Line chart: "Hoạt Động Hàng Ngày"
- ✅ Tooltips show on hover
- ✅ Responsive on mobile

---

## 📋 Test Case 6: Profile Page

### Test 6.1: Auto-Load Profile

**Steps:**

1. Connect wallet
2. Navigate to `/profile`

**Expected Result:**

- ✅ Profile loads automatically (no URL param needed)
- ✅ Shows user's wallet address
- ✅ Displays avatar (Dicebear)
- ✅ Shows stats: Deals Created, Completed, Trust Score
- ✅ Lists user's deal history

### Test 6.2: Profile Without Wallet

**Steps:**

1. Disconnect wallet
2. Navigate to `/profile`

**Expected Result:**

- ✅ Message: "Vui lòng kết nối ví để xem profile"
- ✅ No errors in console

### Test 6.3: Profile Tabs

**Steps:**

1. Click "Overview" tab
2. Click "Stats" tab
3. Click "History" tab

**Expected Result:**

- ✅ Each tab displays correct content
- ✅ Stats show performance metrics
- ✅ History shows user's deals

---

## 📋 Test Case 7: LocalStorage Persistence

### Test 7.1: Deal IDs Storage

**Steps:**

1. Create a deal
2. Open DevTools → Application → Local Storage
3. Check `deal_ids` key

**Expected Result:**

- ✅ `deal_ids` contains array of deal IDs
- ✅ New deals append to array
- ✅ No duplicates

### Test 7.2: Page Refresh

**Steps:**

1. Create deals
2. Refresh page (F5)
3. Navigate to `/deals`

**Expected Result:**

- ✅ Deals persist after refresh
- ✅ Data loads from localStorage
- ✅ Fetches latest data from blockchain

### Test 7.3: Clear Storage

**Steps:**

1. Clear localStorage
2. Refresh `/deals` page

**Expected Result:**

- ✅ Shows "Không tìm thấy giao dịch nào"
- ✅ Dashboard shows zero stats
- ✅ No console errors

---

## 📋 Test Case 8: Responsive Design

### Test 8.1: Mobile View (375px - 767px)

**Steps:**

1. Open DevTools responsive mode
2. Set viewport to iPhone SE (375px)
3. Navigate through all pages

**Expected Result:**

- ✅ Navbar collapses to hamburger menu
- ✅ Logo text hides, icon remains
- ✅ Cards stack vertically
- ✅ Forms are full-width
- ✅ Charts scale properly
- ✅ No horizontal scroll

### Test 8.2: Tablet View (768px - 1023px)

**Expected Result:**

- ✅ 2-column grid layouts
- ✅ Navbar shows all links
- ✅ Charts maintain aspect ratio

### Test 8.3: Desktop View (1024px+)

**Expected Result:**

- ✅ 3-column layouts for deals
- ✅ Centered navigation
- ✅ Full-width charts
- ✅ Optimal spacing

---

## 📋 Test Case 9: Error Handling

### Test 9.1: Network Errors

**Steps:**

1. Disconnect internet
2. Try to create deal
3. Reconnect and retry

**Expected Result:**

- ✅ Error toast appears
- ✅ User can retry
- ✅ No app crash

### Test 9.2: Invalid Deal ID

**Steps:**

1. Navigate to `/deal/0xinvalidid`

**Expected Result:**

- ✅ Error page shows
- ✅ Message: "Không tìm thấy Deal này!"
- ✅ Can navigate back

### Test 9.3: Insufficient Balance

**Steps:**

1. Try to create deal larger than wallet balance

**Expected Result:**

- ✅ Wallet shows error
- ✅ Transaction fails gracefully
- ✅ Error toast displays

---

## 📋 Test Case 10: Performance

### Test 10.1: Page Load Time

**Steps:**

1. Open DevTools → Network → Disable cache
2. Hard refresh homepage (Ctrl+Shift+R)
3. Check "Load" time

**Expected Result:**

- ✅ Page loads < 2 seconds
- ✅ No blocking resources
- ✅ Lighthouse score > 80

### Test 10.2: Deal List with Many Items

**Steps:**

1. Create 20+ deals
2. Navigate to `/deals`
3. Check rendering performance

**Expected Result:**

- ✅ List renders smoothly
- ✅ Search/filter is fast
- ✅ No lag on scroll

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **LocalStorage-based**: Deals only visible on browser that created them
   - Not synced across devices
   - Cleared if localStorage is cleared
2. **No Backend**:

   - No centralized deal registry
   - No notifications
   - No user authentication

3. **Devnet Only**:
   - Transactions are on testnet
   - Tokens have no real value

### Future Improvements

- [ ] Implement Sui Indexer for global deal listing
- [ ] Add backend API for cross-device sync
- [ ] Implement WebSocket for real-time updates
- [ ] Add push notifications
- [ ] Deploy to Mainnet

---

## 📊 Test Coverage Summary

| Category       | Tests  | Status |
| -------------- | ------ | ------ |
| Navigation     | 3      | ✅     |
| Create Deal    | 3      | ✅     |
| Deal Detail    | 4      | ✅     |
| Deals List     | 3      | ✅     |
| Dashboard      | 2      | ✅     |
| Profile        | 3      | ✅     |
| Storage        | 3      | ✅     |
| Responsive     | 3      | ✅     |
| Error Handling | 3      | ✅     |
| Performance    | 2      | ✅     |
| **TOTAL**      | **29** | **✅** |

---

## 🚀 Quick Smoke Test (5 minutes)

Run these essential tests to verify basic functionality:

1. ✅ Homepage loads
2. ✅ Connect wallet works
3. ✅ Create deal succeeds
4. ✅ Deal appears in `/deals`
5. ✅ Dashboard shows data
6. ✅ Profile loads automatically

**If all pass → App is functional! 🎉**

---

## 📝 Bug Report Template

If you find a bug, report it with this format:

```
**Title**: [Short description]

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:

**Actual Result**:

**Screenshots**:

**Environment**:
- Browser:
- Wallet:
- Network:
- localStorage:
```

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
**Tested By**: Development Team

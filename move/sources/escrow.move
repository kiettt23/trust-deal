module trustdeal::escrow {
    // --- IMPORTS (Move 2024 - chỉ import những thứ không auto-import) ---
    use sui::coin::{Self, Coin}; 
    use sui::sui::SUI; 
    use sui::balance::{Self, Balance};

    // --- CONSTANTS ---
    const STATUS_CREATED: u8 = 0;
    const STATUS_LOCKED: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const STATUS_CANCELLED: u8 = 3;

    // --- ERRORS ---
    const E_NOT_BUYER: u64 = 1;
    const E_INVALID_STATUS: u64 = 2;
    const E_INSUFFICIENT_PAYMENT: u64 = 3;
    const E_NOT_AUTHORIZED: u64 = 4;

    // --- STRUCTS (Move 2024 yêu cầu visibility modifier) ---
    public struct Deal has key, store {
        id: UID,
        seller: address,
        buyer: Option<address>, 
        amount: u64,
        status: u8,
        escrowed_balance: Balance<SUI>, 
    }

    // --- FUNCTIONS ---

    // 1. Tạo Deal (Người bán)
    public fun create_deal(price: u64, ctx: &mut TxContext) {
        let seller_address = ctx.sender();
        let deal = Deal {
            id: object::new(ctx),
            seller: seller_address,
            buyer: option::none<address>(), 
            amount: price,
            status: STATUS_CREATED,
            escrowed_balance: balance::zero(), 
        };
        transfer::share_object(deal);
    }

    // 2. Nạp tiền (Người mua)
    public fun deposit(
        deal: &mut Deal, 
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        // --- BƯỚC 1: VALIDATION ---
        
        // Check trạng thái: Phải là CREATED (0) mới cho nạp. Locked rồi thì thôi.
        assert!(deal.status == STATUS_CREATED, E_INVALID_STATUS);

        // Check số tiền: Cục tiền gửi vào (payment) phải >= giá yêu cầu (deal.amount)
        let payment_value = coin::value(&payment);
        assert!(payment_value >= deal.amount, E_INSUFFICIENT_PAYMENT);

        // --- BƯỚC 2: LOGIC XỬ LÝ ---

        // A. Cập nhật người mua
        let buyer_address = ctx.sender();
        // Điền địa chỉ người mua vào cái hộp Option đang rỗng
        deal.buyer.fill(buyer_address);

        // B. Xử lý tiền (Quan trọng nhất!)
        // Biến Coin (Object) thành Balance (Số dư)
        let coin_balance = coin::into_balance(payment);
        // Đổ cái số dư vừa đổi được vào két sắt của Deal
        deal.escrowed_balance.join(coin_balance);

        // C. Cập nhật trạng thái
        deal.status = STATUS_LOCKED;
    }

    // 3. Xác nhận nhận hàng & Trả tiền cho Seller
    public fun confirm_delivery(deal: &mut Deal, ctx: &mut TxContext) {
        let sender = ctx.sender();

        // A. Check quyền: Người gọi hàm có phải là Buyer không?
        assert!(deal.buyer.contains(&sender), E_NOT_BUYER);

        // B. Check trạng thái: Phải đang bị khóa tiền thì mới confirm được
        assert!(deal.status == STATUS_LOCKED, E_INVALID_STATUS);

        // C. Xử lý tiền: Rút sạch két sắt
        let amount = deal.escrowed_balance.value();
        let payment = coin::take(&mut deal.escrowed_balance, amount, ctx);

        // D. Chuyển tiền cho Seller
        transfer::public_transfer(payment, deal.seller);

        // E. Update trạng thái
        deal.status = STATUS_COMPLETED;
    }

    // 4. Hủy kèo & Hoàn tiền (Refund)
    public fun cancel_deal(deal: &mut Deal, ctx: &mut TxContext) {
        let sender = ctx.sender();
        
        // A. Check quyền: Chỉ Seller hoặc Buyer mới được hủy
        let is_seller = deal.seller == sender;
        let is_buyer = deal.buyer.contains(&sender);
        assert!(is_seller || is_buyer, E_NOT_AUTHORIZED);

        // B. Check trạng thái: Chỉ hủy được khi chưa hoàn thành
        assert!(deal.status == STATUS_CREATED || deal.status == STATUS_LOCKED, E_INVALID_STATUS);

        // C. Xử lý hoàn tiền (Refund Logic)
        if (deal.status == STATUS_LOCKED) {
            // Nếu đã có tiền trong két -> Trả lại cho Buyer
            let amount = deal.escrowed_balance.value();
            let refund = coin::take(&mut deal.escrowed_balance, amount, ctx);
            
            // Lấy địa chỉ Buyer ra để chuyển tiền
            let buyer_addr = *deal.buyer.borrow();
            transfer::public_transfer(refund, buyer_addr);
        };

        // D. Update trạng thái
        deal.status = STATUS_CANCELLED;
    }
}
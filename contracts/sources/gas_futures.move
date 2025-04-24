/// @title Gas Futures
/// @notice This module allows users to trade gas futures contracts
module sui_gas_futures::gas_futures {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    
    use sui_gas_futures::gas_credit::{Self, GasCredit};
    
    /// @notice Error when the order has already been matched
    const EOrderAlreadyMatched: u64 = 1;
    /// @notice Error when the order has expired
    const EOrderExpired: u64 = 2;
    /// @notice Error when the payment is insufficient
    const EInsufficientPayment: u64 = 3;
    /// @notice Error when the caller is not the owner
    const ENotAuthorized: u64 = 4;
    /// @notice Error when trying to match your own order
    const ECannotMatchOwnOrder: u64 = 5;
    /// @notice Error when the order is not in a state to be matched
    const EOrderNotMatchable: u64 = 6;
    
    /// @notice Platform fee percentage (0.2%)
    const PLATFORM_FEE_BPS: u64 = 20; // 20 basis points = 0.2%
    /// @notice Basis points denominator
    const BASIS_POINTS: u64 = 10000; // 100%
    
    /// @notice Order status enum
    const ORDER_STATUS_OPEN: u8 = 0;
    const ORDER_STATUS_FILLED: u8 = 1;
    const ORDER_STATUS_CANCELLED: u8 = 2;
    
    /// @notice Order type enum
    const ORDER_TYPE_BUY: u8 = 0;
    const ORDER_TYPE_SELL: u8 = 1;
    
    /// @notice Gas Futures order
    struct GasFutureOrder has key, store {
        id: UID,
        /// @notice Creator of the order
        creator: address,
        /// @notice Order type (buy or sell)
        order_type: u8,
        /// @notice Price per gas credit
        price: u64,
        /// @notice Total amount of credits to trade
        amount: u64,
        /// @notice Timestamp when the order was created
        created_at: u64,
        /// @notice Timestamp when the order expires
        expires_at: u64,
        /// @notice Current status of the order
        status: u8,
        /// @notice Duration for the gas credit contract (30, 60, 90 days)
        duration_type: u8,
        /// @notice Escrow balance for buy orders
        escrow: Balance<SUI>,
    }
    
    /// @notice Gas Futures marketplace
    struct GasFuturesMarketplace has key {
        id: UID,
        /// @notice Treasury for collecting fees
        treasury: Balance<SUI>,
        /// @notice Admin address
        admin: address,
        /// @notice Order ID to order mapping
        orders: Table<ID, GasFutureOrder>,
        /// @notice Total volume traded
        total_volume: u64,
        /// @notice Risk management fund
        risk_fund: Balance<SUI>,
    }
    
    /// @notice Event emitted when a new order is created
    struct OrderCreated has copy, drop {
        order_id: ID,
        creator: address,
        order_type: u8,
        price: u64,
        amount: u64,
        expires_at: u64,
        duration_type: u8,
    }
    
    /// @notice Event emitted when an order is matched
    struct OrderMatched has copy, drop {
        order_id: ID,
        matcher: address,
        price: u64,
        amount: u64,
        total_cost: u64,
        fee_amount: u64,
    }
    
    /// @notice Event emitted when an order is cancelled
    struct OrderCancelled has copy, drop {
        order_id: ID,
        creator: address,
    }
    
    /// @notice Initialize the Gas Futures Marketplace
    fun init(ctx: &mut TxContext) {
        let marketplace = GasFuturesMarketplace {
            id: object::new(ctx),
            treasury: balance::zero(),
            admin: tx_context::sender(ctx),
            orders: table::new(ctx),
            total_volume: 0,
            risk_fund: balance::zero(),
        };
        
        transfer::share_object(marketplace);
    }
    
    /// @notice Create a new buy order for gas futures
    public entry fun create_buy_order(
        marketplace: &mut GasFuturesMarketplace,
        payment: &mut Coin<SUI>,
        price: u64,
        amount: u64,
        duration_type: u8,
        valid_for: u64, // Duration in seconds that the order is valid for
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Calculate the total cost including the platform fee
        let total_cost = price * amount;
        let fee_amount = (total_cost * PLATFORM_FEE_BPS) / BASIS_POINTS;
        let escrow_amount = total_cost + fee_amount;
        
        // Ensure user has enough balance
        assert!(coin::value(payment) >= escrow_amount, EInsufficientPayment);
        
        // Take payment to escrow
        let payment_balance = coin::balance_mut(payment);
        let escrow_balance = balance::split(payment_balance, escrow_amount);
        
        // Calculate expiration time
        let current_time_ms = clock::timestamp_ms(clock);
        let expires_at = current_time_ms + (valid_for * 1000); // Convert seconds to milliseconds
        
        // Create order object
        let order = GasFutureOrder {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            order_type: ORDER_TYPE_BUY,
            price,
            amount,
            created_at: current_time_ms,
            expires_at,
            status: ORDER_STATUS_OPEN,
            duration_type,
            escrow: escrow_balance,
        };
        
        // Get the order ID
        let order_id = object::id(&order);
        
        // Emit event
        event::emit(OrderCreated {
            order_id,
            creator: tx_context::sender(ctx),
            order_type: ORDER_TYPE_BUY,
            price,
            amount,
            expires_at,
            duration_type,
        });
        
        // Add order to marketplace
        table::add(&mut marketplace.orders, order_id, order);
    }
    
    /// @notice Create a new sell order for gas futures
    public entry fun create_sell_order(
        marketplace: &mut GasFuturesMarketplace,
        price: u64,
        amount: u64,
        duration_type: u8,
        valid_for: u64, // Duration in seconds that the order is valid for
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Calculate expiration time
        let current_time_ms = clock::timestamp_ms(clock);
        let expires_at = current_time_ms + (valid_for * 1000); // Convert seconds to milliseconds
        
        // Create order object with empty escrow balance
        let order = GasFutureOrder {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            order_type: ORDER_TYPE_SELL,
            price,
            amount,
            created_at: current_time_ms,
            expires_at,
            status: ORDER_STATUS_OPEN,
            duration_type,
            escrow: balance::zero(), // No escrow needed for sell orders
        };
        
        // Get the order ID
        let order_id = object::id(&order);
        
        // Emit event
        event::emit(OrderCreated {
            order_id,
            creator: tx_context::sender(ctx),
            order_type: ORDER_TYPE_SELL,
            price,
            amount,
            expires_at,
            duration_type,
        });
        
        // Add order to marketplace
        table::add(&mut marketplace.orders, order_id, order);
    }
    
    /// @notice Match a buy order by selling gas credits
    public entry fun match_buy_order(
        marketplace: &mut GasFuturesMarketplace,
        order_id: ID,
        gas_platform: &mut sui_gas_futures::gas_credit::GasFuturesPlatform,
        payment: &mut Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Get order from marketplace
        assert!(table::contains(&marketplace.orders, order_id), EOrderNotMatchable);
        let order = table::borrow_mut(&mut marketplace.orders, order_id);
        
        // Verify order is still open
        assert!(order.status == ORDER_STATUS_OPEN, EOrderAlreadyMatched);
        
        // Verify order has not expired
        let current_time_ms = clock::timestamp_ms(clock);
        assert!(current_time_ms <= order.expires_at, EOrderExpired);
        
        // Verify order type is buy
        assert!(order.order_type == ORDER_TYPE_BUY, EOrderNotMatchable);
        
        // Verify not matching own order
        assert!(tx_context::sender(ctx) != order.creator, ECannotMatchOwnOrder);
        
        // Get escrow from order
        let order_escrow = &mut order.escrow;
        
        // Calculate fee amount
        let total_cost = order.price * order.amount;
        let fee_amount = (total_cost * PLATFORM_FEE_BPS) / BASIS_POINTS;
        
        // Split fee from escrow
        let fee_balance = balance::split(order_escrow, fee_amount);
        
        // Calculate risk fund contribution (10% of fee)
        let risk_fund_amount = fee_amount / 10;
        let treasury_amount = fee_amount - risk_fund_amount;
        
        // Split fee between treasury and risk fund
        let risk_balance = balance::split(&mut fee_balance, risk_fund_amount);
        let treasury_balance = fee_balance; // Remaining balance
        
        // Add fees to marketplace
        balance::join(&mut marketplace.treasury, treasury_balance);
        balance::join(&mut marketplace.risk_fund, risk_balance);
        
        // Create a gas credit for the buyer (order creator)
        // First get payment for the gas credit creation
        let payment_amount = total_cost;
        let payment_balance = coin::balance_mut(payment);
        let gas_payment = balance::split(payment_balance, payment_amount);
        
        // Convert balance to coin for the gas credit purchase
        let gas_payment_coin = coin::from_balance(gas_payment, ctx);
        
        // Call the gas_credit module to create a gas credit
        // In a production implementation, we would directly call the gas_credit module
        // For simplicity, we're simulating the creation here
        
        // Update order status
        order.status = ORDER_STATUS_FILLED;
        
        // Update total volume
        marketplace.total_volume = marketplace.total_volume + total_cost;
        
        // Emit event
        event::emit(OrderMatched {
            order_id,
            matcher: tx_context::sender(ctx),
            price: order.price,
            amount: order.amount,
            total_cost,
            fee_amount,
        });
        
        // Transfer remaining escrow to the matcher (seller)
        let matcher_balance = balance::withdraw_all(order_escrow);
        let matcher_coin = coin::from_balance(matcher_balance, ctx);
        transfer::public_transfer(matcher_coin, tx_context::sender(ctx));
        
        // Note: In a real implementation, we would create the actual gas credit
        // and transfer it to the buyer (order creator) here
    }
    
    /// @notice Match a sell order by buying gas credits
    public entry fun match_sell_order(
        marketplace: &mut GasFuturesMarketplace,
        order_id: ID,
        payment: &mut Coin<SUI>,
        gas_platform: &mut sui_gas_futures::gas_credit::GasFuturesPlatform,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Get order from marketplace
        assert!(table::contains(&marketplace.orders, order_id), EOrderNotMatchable);
        let order = table::borrow_mut(&mut marketplace.orders, order_id);
        
        // Verify order is still open
        assert!(order.status == ORDER_STATUS_OPEN, EOrderAlreadyMatched);
        
        // Verify order has not expired
        let current_time_ms = clock::timestamp_ms(clock);
        assert!(current_time_ms <= order.expires_at, EOrderExpired);
        
        // Verify order type is sell
        assert!(order.order_type == ORDER_TYPE_SELL, EOrderNotMatchable);
        
        // Verify not matching own order
        assert!(tx_context::sender(ctx) != order.creator, ECannotMatchOwnOrder);
        
        // Calculate total cost and fee
        let total_cost = order.price * order.amount;
        let fee_amount = (total_cost * PLATFORM_FEE_BPS) / BASIS_POINTS;
        let total_payment = total_cost + fee_amount;
        
        // Ensure buyer has enough balance
        assert!(coin::value(payment) >= total_payment, EInsufficientPayment);
        
        // Take payment
        let payment_balance = coin::balance_mut(payment);
        let paid = balance::split(payment_balance, total_payment);
        
        // Calculate risk fund contribution (10% of fee)
        let risk_fund_amount = fee_amount / 10;
        let treasury_amount = fee_amount - risk_fund_amount;
        
        // Split payment into components
        let treasury_balance = balance::split(&mut paid, treasury_amount);
        let risk_balance = balance::split(&mut paid, risk_fund_amount);
        let seller_balance = paid; // Remaining balance
        
        // Add fees to marketplace
        balance::join(&mut marketplace.treasury, treasury_balance);
        balance::join(&mut marketplace.risk_fund, risk_balance);
        
        // Update order status
        order.status = ORDER_STATUS_FILLED;
        
        // Update total volume
        marketplace.total_volume = marketplace.total_volume + total_cost;
        
        // Emit event
        event::emit(OrderMatched {
            order_id,
            matcher: tx_context::sender(ctx),
            price: order.price,
            amount: order.amount,
            total_cost,
            fee_amount,
        });
        
        // Transfer payment to the seller (order creator)
        let seller_coin = coin::from_balance(seller_balance, ctx);
        transfer::public_transfer(seller_coin, order.creator);
        
        // Create a gas credit for the matcher (buyer)
        // In a production implementation, we would directly call the gas_credit module
        // For simplicity, we're simulating the creation here
        
        // Note: In a real implementation, we would create the actual gas credit
        // and transfer it to the matcher (buyer) here
    }
    
    /// @notice Cancel an existing order
    public entry fun cancel_order(
        marketplace: &mut GasFuturesMarketplace,
        order_id: ID,
        ctx: &mut TxContext
    ) {
        // Get order from marketplace
        assert!(table::contains(&marketplace.orders, order_id), EOrderNotMatchable);
        let order = table::borrow_mut(&mut marketplace.orders, order_id);
        
        // Verify caller is the order creator
        assert!(tx_context::sender(ctx) == order.creator, ENotAuthorized);
        
        // Verify order is still open
        assert!(order.status == ORDER_STATUS_OPEN, EOrderAlreadyMatched);
        
        // Update order status
        order.status = ORDER_STATUS_CANCELLED;
        
        // If it's a buy order, return the escrowed funds
        if (order.order_type == ORDER_TYPE_BUY) {
            let escrow_balance = balance::withdraw_all(&mut order.escrow);
            let return_coin = coin::from_balance(escrow_balance, ctx);
            transfer::public_transfer(return_coin, order.creator);
        }
        
        // Emit event
        event::emit(OrderCancelled {
            order_id,
            creator: order.creator,
        });
    }
    
    /// @notice Get details of an order
    public fun get_order_details(
        marketplace: &GasFuturesMarketplace,
        order_id: ID
    ): (address, u8, u64, u64, u64, u64, u8, u8) {
        let order = table::borrow(&marketplace.orders, order_id);
        (
            order.creator,
            order.order_type,
            order.price,
            order.amount,
            order.created_at,
            order.expires_at,
            order.status,
            order.duration_type
        )
    }
    
    /// @notice Get marketplace statistics
    public fun get_marketplace_stats(marketplace: &GasFuturesMarketplace): u64 {
        marketplace.total_volume
    }
} 
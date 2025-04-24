/// @title Gas Credit
/// @notice This module allows users to purchase gas credits at a fixed price for future use
module sui_gas_futures::gas_credit {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;
    
    /// @notice Error when the gas credit is expired
    const EGasCreditExpired: u64 = 1;
    /// @notice Error when the user has insufficient credits
    const EInsufficientCredits: u64 = 2;
    /// @notice Error when the contract is already initialized
    const EAlreadyInitialized: u64 = 3;
    /// @notice Error when the caller is not authorized
    const ENotAuthorized: u64 = 4;
    /// @notice Error when an invalid contract duration is provided
    const EInvalidDuration: u64 = 5;

    /// @notice Available contract durations (in days)
    const DURATION_30_DAYS: u64 = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const DURATION_60_DAYS: u64 = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds
    const DURATION_90_DAYS: u64 = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    
    /// @notice Platform fee percentage (0.1%)
    const PLATFORM_FEE_BPS: u64 = 10; // 10 basis points = 0.1%
    /// @notice Basis points denominator
    const BASIS_POINTS: u64 = 10000; // 100%

    /// @notice Gas Credit contract data
    struct GasCredit has key, store {
        id: UID,
        owner: address,
        /// @notice The locked gas price in SUI per computation unit
        locked_price: u64,
        /// @notice Total number of gas credits purchased
        total_credits: u64,
        /// @notice Number of gas credits used
        used_credits: u64,
        /// @notice Expiry timestamp in milliseconds
        expires_at: u64,
        /// @notice Contract duration type (30, 60, or 90 days)
        duration_type: u8,
    }
    
    /// @notice Gas Futures Platform for managing credits and settings
    struct GasFuturesPlatform has key {
        id: UID,
        /// @notice Treasury balance for collecting fees
        treasury: Balance<SUI>,
        /// @notice Admin address for updating settings
        admin: address,
        /// @notice Current reference gas price from the oracle
        current_ref_gas_price: u64,
        /// @notice Current storage gas price from the oracle
        current_storage_gas_price: u64,
        /// @notice Contract prices for different durations (duration_type => price)
        contract_prices: Table<u8, u64>,
        /// @notice Risk management fund balance
        risk_fund: Balance<SUI>,
    }
    
    /// @notice Capability for the admin to update platform settings
    struct AdminCap has key {
        id: UID,
    }
    
    /// @notice Event emitted when a gas credit is created
    struct GasCreditCreated has copy, drop {
        credit_id: ID,
        owner: address,
        locked_price: u64,
        total_credits: u64,
        expires_at: u64,
        duration_type: u8,
    }
    
    /// @notice Event emitted when gas credits are used
    struct GasCreditUsed has copy, drop {
        credit_id: ID,
        owner: address,
        credits_used: u64,
        credits_remaining: u64,
    }
    
    /// @notice Event emitted when the reference gas price is updated
    struct GasPriceUpdated has copy, drop {
        ref_gas_price: u64,
        storage_gas_price: u64,
        timestamp: u64,
    }
    
    /// @notice Initialize the Gas Futures Platform
    fun init(ctx: &mut TxContext) {
        let platform = GasFuturesPlatform {
            id: object::new(ctx),
            treasury: balance::zero(),
            admin: tx_context::sender(ctx),
            current_ref_gas_price: 250, // Initial price of 0.00025 SUI (in MIST)
            current_storage_gas_price: 100, // Initial price of 0.00010 SUI (in MIST)
            contract_prices: table::new(ctx),
            risk_fund: balance::zero(),
        };
        
        // Initialize contract prices (discounted from current price)
        table::add(&mut platform.contract_prices, 30, 220); // 30-day price: 0.00022 SUI
        table::add(&mut platform.contract_prices, 60, 230); // 60-day price: 0.00023 SUI
        table::add(&mut platform.contract_prices, 90, 240); // 90-day price: 0.00024 SUI
        
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        
        // Transfer the objects to the deployer
        transfer::share_object(platform);
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }
    
    /// @notice Purchase a new gas credit contract
    public entry fun purchase_gas_credit(
        platform: &mut GasFuturesPlatform,
        payment: &mut Coin<SUI>,
        duration_type: u8, // 30, 60, or 90 days
        credit_amount: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify valid duration type
        assert!(
            duration_type == 30 || duration_type == 60 || duration_type == 90,
            EInvalidDuration
        );
        
        // Get contract price for the selected duration
        let locked_price = *table::borrow(&platform.contract_prices, duration_type);
        
        // Calculate total cost
        let total_cost = locked_price * credit_amount;
        
        // Calculate platform fee (0.1%)
        let fee_amount = (total_cost * PLATFORM_FEE_BPS) / BASIS_POINTS;
        
        // Calculate risk fund contribution (10% of fee)
        let risk_fund_amount = fee_amount / 10;
        let treasury_amount = fee_amount - risk_fund_amount;
        
        // Ensure user has enough balance
        let total_payment = total_cost + fee_amount;
        assert!(coin::value(payment) >= total_payment, EInsufficientCredits);
        
        // Take payment
        let payment_balance = coin::balance_mut(payment);
        let paid = balance::split(payment_balance, total_payment);
        
        // Split payment into components
        let treasury_balance = balance::split(&mut paid, treasury_amount);
        let risk_balance = balance::split(&mut paid, risk_fund_amount);
        let contract_balance = paid; // Remaining balance
        
        // Add fees to platform
        balance::join(&mut platform.treasury, treasury_balance);
        balance::join(&mut platform.risk_fund, risk_balance);
        
        // Determine expiry timestamp based on duration
        let duration_ms = if (duration_type == 30) {
            DURATION_30_DAYS
        } else if (duration_type == 60) {
            DURATION_60_DAYS
        } else {
            DURATION_90_DAYS
        };
        
        let current_time_ms = clock::timestamp_ms(clock);
        let expires_at = current_time_ms + duration_ms;
        
        // Create gas credit
        let gas_credit = GasCredit {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            locked_price,
            total_credits: credit_amount,
            used_credits: 0,
            expires_at,
            duration_type,
        };
        
        // Emit event
        event::emit(GasCreditCreated {
            credit_id: object::id(&gas_credit),
            owner: tx_context::sender(ctx),
            locked_price,
            total_credits: credit_amount,
            expires_at,
            duration_type,
        });
        
        // Return unused balance to the payment coin
        balance::join(payment_balance, contract_balance);
        
        // Transfer gas credit to the purchaser
        transfer::transfer(gas_credit, tx_context::sender(ctx));
    }
    
    /// @notice Use gas credits for transaction fees
    /// This would be called by the transaction processor
    public fun use_gas_credits(
        gas_credit: &mut GasCredit,
        credits_to_use: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): u64 {
        // Check if credit is still valid
        let current_time_ms = clock::timestamp_ms(clock);
        assert!(current_time_ms <= gas_credit.expires_at, EGasCreditExpired);
        
        // Check if caller is the owner
        assert!(gas_credit.owner == tx_context::sender(ctx), ENotAuthorized);
        
        // Check if enough credits remaining
        let remaining_credits = gas_credit.total_credits - gas_credit.used_credits;
        assert!(remaining_credits >= credits_to_use, EInsufficientCredits);
        
        // Update used credits
        gas_credit.used_credits = gas_credit.used_credits + credits_to_use;
        
        // Emit event
        event::emit(GasCreditUsed {
            credit_id: object::id(gas_credit),
            owner: gas_credit.owner,
            credits_used: credits_to_use,
            credits_remaining: gas_credit.total_credits - gas_credit.used_credits,
        });
        
        // Return the locked price to be used for gas calculation
        gas_credit.locked_price
    }
    
    /// @notice Update the reference gas price (admin only)
    public entry fun update_gas_price(
        platform: &mut GasFuturesPlatform,
        admin_cap: &AdminCap,
        ref_gas_price: u64,
        storage_gas_price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify the caller is the admin
        assert!(tx_context::sender(ctx) == platform.admin, ENotAuthorized);
        
        // Update prices
        platform.current_ref_gas_price = ref_gas_price;
        platform.current_storage_gas_price = storage_gas_price;
        
        // Emit event
        event::emit(GasPriceUpdated {
            ref_gas_price,
            storage_gas_price,
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    /// @notice Update contract prices for different durations (admin only)
    public entry fun update_contract_prices(
        platform: &mut GasFuturesPlatform,
        admin_cap: &AdminCap,
        price_30_day: u64,
        price_60_day: u64,
        price_90_day: u64,
        ctx: &mut TxContext
    ) {
        // Verify the caller is the admin
        assert!(tx_context::sender(ctx) == platform.admin, ENotAuthorized);
        
        // Update prices
        *table::borrow_mut(&mut platform.contract_prices, 30) = price_30_day;
        *table::borrow_mut(&mut platform.contract_prices, 60) = price_60_day;
        *table::borrow_mut(&mut platform.contract_prices, 90) = price_90_day;
    }
    
    /// @notice Get the current gas prices
    public fun get_current_gas_prices(platform: &GasFuturesPlatform): (u64, u64) {
        (platform.current_ref_gas_price, platform.current_storage_gas_price)
    }
    
    /// @notice Get details of a gas credit
    public fun get_gas_credit_details(gas_credit: &GasCredit): (u64, u64, u64, u64, u8) {
        (
            gas_credit.locked_price,
            gas_credit.total_credits,
            gas_credit.used_credits,
            gas_credit.expires_at,
            gas_credit.duration_type
        )
    }
    
    /// @notice Calculate savings from using gas credits
    public fun calculate_savings(
        gas_credit: &GasCredit,
        platform: &GasFuturesPlatform
    ): u64 {
        let current_price = platform.current_ref_gas_price;
        let locked_price = gas_credit.locked_price;
        
        // If current price is higher, user saves money
        if (current_price > locked_price) {
            let used_credits = gas_credit.used_credits;
            (current_price - locked_price) * used_credits
        } else {
            0
        }
    }
} 
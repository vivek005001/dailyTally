// Shop Daily Dashboard - Main Application Logic

// Initialize Supabase client
let supabaseClient;
try {
    const { createClient } = window.supabase;
    supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
    alert('Please configure your Supabase credentials in config.js');
}

// State
let currentItems = [];
let currentDailySales = null;

// DOM Elements
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.getElementById('addItemBtn');
const salesForm = document.getElementById('salesForm');
const clearBtn = document.getElementById('clearBtn');
const resetBtn = document.getElementById('resetBtn');
const totalAmount = document.getElementById('totalAmount');
const todayTotal = document.getElementById('todayTotal');
const todayCount = document.getElementById('todayCount');
const currentDate = document.getElementById('currentDate');
const historyContainer = document.getElementById('historyContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Display current date
    updateDateDisplay();

    // Test Supabase connection
    await testSupabaseConnection();

    // Add initial item row
    addItemRow();

    // Set up event listeners
    addItemBtn.addEventListener('click', addItemRow);
    clearBtn.addEventListener('click', clearForm);
    resetBtn.addEventListener('click', handleReset);
    salesForm.addEventListener('submit', handleFormSubmit);

    // Load data
    await checkAndCreateDailyRecord();
    await loadTodaySummary();
    await loadSalesHistory();

    // Check for day change every minute
    setInterval(checkDayChange, 60000);
}

function updateDateDisplay() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = today.toLocaleDateString('en-IN', options);
}

// Test Supabase Connection
async function testSupabaseConnection() {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'connectionStatus';
    statusIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(statusIndicator);

    statusIndicator.textContent = '🔄 Testing connection...';
    statusIndicator.style.background = 'linear-gradient(135deg, hsl(40, 80%, 50%), hsl(45, 80%, 60%))';
    statusIndicator.style.color = 'white';

    try {
        // Try to query the daily_sales table
        const { data, error } = await supabaseClient
            .from('daily_sales')
            .select('id')
            .limit(1);

        if (error) {
            throw error;
        }

        // Connection successful
        statusIndicator.textContent = '✅ Supabase Connected';
        statusIndicator.style.background = 'linear-gradient(135deg, hsl(140, 60%, 50%), hsl(160, 60%, 50%))';

        console.log('✅ Supabase connection test passed!');
        console.log('Database URL:', SUPABASE_CONFIG.url);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusIndicator.style.opacity = '0';
            setTimeout(() => statusIndicator.remove(), 300);
        }, 3000);

    } catch (error) {
        // Connection failed
        statusIndicator.textContent = '❌ Connection Failed';
        statusIndicator.style.background = 'linear-gradient(135deg, hsl(0, 70%, 60%), hsl(10, 70%, 65%))';

        console.error('❌ Supabase connection test failed!');
        console.error('Error:', error);
        console.error('Error details:', error.message);
        console.error('Configured URL:', SUPABASE_CONFIG.url);

        // Show detailed error
        setTimeout(() => {
            statusIndicator.innerHTML = `
                ❌ Database Error<br>
                <small style="font-size: 11px; opacity: 0.9;">${error.message}</small>
            `;
        }, 1000);

        // Don't auto-hide on error
    }
}

// Item Management
function addItemRow() {
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
    <div class="form-group">
      <label class="form-label">Item Name</label>
      <input type="text" class="form-input item-name" placeholder="e.g., Product A" required>
    </div>
    <div class="form-group">
      <label class="form-label">Price (₹)</label>
      <input type="number" class="form-input item-price" placeholder="0.00" step="0.01" min="0" required>
    </div>
    <div class="form-group">
      <label class="form-label">Quantity</label>
      <input type="number" class="form-input item-quantity" placeholder="1" min="1" value="1" required>
    </div>
    <button type="button" class="btn-remove" title="Remove item">×</button>
  `;

    // Add event listeners for real-time calculation
    const priceInput = itemRow.querySelector('.item-price');
    const quantityInput = itemRow.querySelector('.item-quantity');
    priceInput.addEventListener('input', calculateTotal);
    quantityInput.addEventListener('input', calculateTotal);

    // Remove button
    const removeBtn = itemRow.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
        if (itemsContainer.children.length > 1) {
            itemRow.remove();
            calculateTotal();
        } else {
            alert('At least one item is required!');
        }
    });

    itemsContainer.appendChild(itemRow);
}

function calculateTotal() {
    let total = 0;
    const itemRows = itemsContainer.querySelectorAll('.item-row');

    itemRows.forEach(row => {
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const quantity = parseInt(row.querySelector('.item-quantity').value) || 0;
        total += price * quantity;
    });

    totalAmount.textContent = `₹${total.toFixed(2)}`;
    return total;
}

function clearForm() {
    itemsContainer.innerHTML = '';
    addItemRow();
    calculateTotal();
}

function getFormItems() {
    const items = [];
    const itemRows = itemsContainer.querySelectorAll('.item-row');

    itemRows.forEach(row => {
        const name = row.querySelector('.item-name').value.trim();
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const quantity = parseInt(row.querySelector('.item-quantity').value) || 0;

        if (name && price > 0 && quantity > 0) {
            items.push({ name, price, quantity });
        }
    });

    return items;
}

// Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const items = getFormItems();
    if (items.length === 0) {
        alert('Please add at least one valid item!');
        return;
    }

    const total = calculateTotal();

    try {
        // Save transaction
        await saveTransaction(items, total);

        // Update daily total
        await updateDailyTotal(total);

        // Generate and print bill
        printBill(items, total);

        // Refresh data
        await loadTodaySummary();

        // Clear form
        clearForm();

    } catch (error) {
        console.error('Error saving sale:', error);
        alert('Failed to save sale. Please check your Supabase configuration.');
    }
}

// Database Operations
async function checkAndCreateDailyRecord() {
    const today = getTodayDate();

    try {
        // Check if record exists for today
        const { data, error } = await supabaseClient
            .from('daily_sales')
            .select('*')
            .eq('date', today)
            .single();

        if (error && error.code === 'PGRST116') {
            // No record found, create one
            const { data: newRecord, error: insertError } = await supabaseClient
                .from('daily_sales')
                .insert([
                    { date: today, total_amount: 0 }
                ])
                .select()
                .single();

            if (insertError) throw insertError;
            currentDailySales = newRecord;
        } else if (error) {
            throw error;
        } else {
            currentDailySales = data;
        }
    } catch (error) {
        console.error('Error checking daily record:', error);
    }
}

async function saveTransaction(items, total) {
    const today = getTodayDate();

    const { data, error } = await supabaseClient
        .from('sales_transactions')
        .insert([
            {
                sale_date: today,
                items: items,
                total_amount: total
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function updateDailyTotal(amount) {
    if (!currentDailySales) {
        await checkAndCreateDailyRecord();
    }

    const newTotal = parseFloat(currentDailySales.total_amount) + amount;

    const { data, error } = await supabaseClient
        .from('daily_sales')
        .update({ total_amount: newTotal, updated_at: new Date().toISOString() })
        .eq('id', currentDailySales.id)
        .select()
        .single();

    if (error) throw error;
    currentDailySales = data;
}

async function loadTodaySummary() {
    const today = getTodayDate();

    try {
        // Get daily total
        const { data: dailyData, error: dailyError } = await supabaseClient
            .from('daily_sales')
            .select('total_amount')
            .eq('date', today)
            .single();

        if (dailyError && dailyError.code !== 'PGRST116') throw dailyError;

        const totalSales = dailyData ? parseFloat(dailyData.total_amount) : 0;
        todayTotal.textContent = `₹${totalSales.toFixed(2)}`;

        // Get transaction count
        const { data: transData, error: transError } = await supabaseClient
            .from('sales_transactions')
            .select('id', { count: 'exact' })
            .eq('sale_date', today);

        if (transError) throw transError;

        todayCount.textContent = transData.length;

    } catch (error) {
        console.error('Error loading today\'s summary:', error);
        todayTotal.textContent = '₹0.00';
        todayCount.textContent = '0';
    }
}

async function loadSalesHistory() {
    try {
        const { data, error } = await supabaseClient
            .from('daily_sales')
            .select('*')
            .order('date', { ascending: false })
            .limit(30);

        if (error) throw error;

        if (!data || data.length === 0) {
            historyContainer.innerHTML = '<div class="empty-message">No sales history yet</div>';
            return;
        }

        // Display history (excluding today for clarity)
        const today = getTodayDate();
        const historyData = data.filter(item => item.date !== today);

        if (historyData.length === 0) {
            historyContainer.innerHTML = '<div class="empty-message">No previous sales history</div>';
            return;
        }

        historyContainer.innerHTML = historyData.map(item => `
      <div class="history-item">
        <span class="history-date">${formatDate(item.date)}</span>
        <span class="history-amount">₹${parseFloat(item.total_amount).toFixed(2)}</span>
      </div>
    `).join('');

    } catch (error) {
        console.error('Error loading sales history:', error);
        historyContainer.innerHTML = '<div class="empty-message">Failed to load history</div>';
    }
}

// Print Bill
function printBill(items, total) {
    const billDate = document.getElementById('billDate');
    const billItems = document.getElementById('billItems');
    const billTotal = document.getElementById('billTotal');

    // Set date
    const now = new Date();
    billDate.textContent = now.toLocaleString('en-IN');

    // Set items
    billItems.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

    // Set total
    billTotal.textContent = `₹${total.toFixed(2)}`;

    // Print
    setTimeout(() => {
        window.print();
    }, 100);
}

// Utility Functions
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

async function checkDayChange() {
    const today = getTodayDate();

    if (currentDailySales && currentDailySales.date !== today) {
        // Day has changed, create new record
        currentDailySales = null;
        await checkAndCreateDailyRecord();
        await loadTodaySummary();
        await loadSalesHistory();
        updateDateDisplay();
    }
}

// Reset All Data
async function handleReset() {
    // Confirm with user
    const confirmed = confirm(
        '⚠️ WARNING: This will permanently delete ALL sales data from the database.\n\n' +
        'This includes:\n' +
        '• All daily sales records\n' +
        '• All transaction history\n' +
        '• All historical data\n\n' +
        'This action CANNOT be undone!\n\n' +
        'Are you sure you want to proceed?'
    );

    if (!confirmed) {
        return;
    }

    // Double confirmation
    const doubleConfirmed = confirm(
        '⚠️ FINAL WARNING!\n\n' +
        'This is your last chance to cancel.\n\n' +
        'Click OK to DELETE ALL DATA permanently.'
    );

    if (!doubleConfirmed) {
        return;
    }

    try {
        resetBtn.disabled = true;
        resetBtn.textContent = '🔄 Resetting...';

        // Delete all sales transactions
        const { error: transError } = await supabaseClient
            .from('sales_transactions')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using impossible ID match)

        if (transError) throw transError;

        // Delete all daily sales
        const { error: dailyError } = await supabaseClient
            .from('daily_sales')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using impossible ID match)

        if (dailyError) throw dailyError;

        // Reset local state
        currentDailySales = null;

        // Refresh UI
        await checkAndCreateDailyRecord();
        await loadTodaySummary();
        await loadSalesHistory();

        alert('✅ All data has been successfully reset!');

    } catch (error) {
        console.error('Error resetting data:', error);
        alert('❌ Failed to reset data. Please check console for details.');
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '<span class="btn-icon">🗑️</span> Reset All Data';
    }
}

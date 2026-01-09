# Shop Daily Dashboard - Supabase Setup Guide

This guide will help you set up the Supabase database for the Shop Daily Dashboard.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: Shop Dashboard
   - Database Password: Choose a strong password
   - Region: Select closest to you
5. Wait for project to be created (takes ~2 minutes)

## Step 2: Create Database Tables

1. In your Supabase project, go to the **SQL Editor**
2. Copy and paste the following SQL script:

```sql
-- Create daily_sales table
CREATE TABLE daily_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales_transactions table
CREATE TABLE sales_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_date DATE NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_sales_date ON daily_sales(date DESC);
CREATE INDEX idx_sales_transactions_date ON sales_transactions(sale_date DESC);

-- Enable Row Level Security
ALTER TABLE daily_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public read access on daily_sales"
  ON daily_sales FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on daily_sales"
  ON daily_sales FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on daily_sales"
  ON daily_sales FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access on sales_transactions"
  ON sales_transactions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on sales_transactions"
  ON sales_transactions FOR INSERT
  WITH CHECK (true);
```

3. Click **Run** to execute the script

## Step 3: Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Find these values:
   - **Project URL**: Copy this (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API keys** → **anon/public**: Copy this key

## Step 4: Configure the Application

1. Open `config.js` in your project
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_PROJECT_URL_HERE',
  anonKey: 'YOUR_ANON_KEY_HERE'
};
```

## Step 5: Run the Application

1. Open `index.html` in a web browser
2. You can use a local server for better experience:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

3. Visit `http://localhost:8000` in your browser

## Database Schema

### daily_sales Table
- `id` (UUID) - Primary key
- `date` (DATE) - Unique date for sales record
- `total_amount` (DECIMAL) - Total sales for the day
- `created_at` (TIMESTAMP) - Record creation time
- `updated_at` (TIMESTAMP) - Last update time

### sales_transactions Table
- `id` (UUID) - Primary key
- `sale_date` (DATE) - Date of the transaction
- `items` (JSONB) - Array of items: `[{name, price, quantity}, ...]`
- `total_amount` (DECIMAL) - Total for this transaction
- `created_at` (TIMESTAMP) - Transaction time

## Security Notes

> [!WARNING]
> The current setup allows **public access** to the database for simplicity. For production use, you should:
> 1. Enable authentication
> 2. Restrict RLS policies to authenticated users
> 3. Add user-specific access controls

## Troubleshooting

**Problem**: "Failed to initialize Supabase" alert
- **Solution**: Make sure you've updated `config.js` with your actual credentials

**Problem**: No data showing in dashboard
- **Solution**: Check browser console for errors. Verify database tables were created correctly.

**Problem**: Print doesn't work
- **Solution**: Ensure browser allows print dialogs. Try a different browser.

## Next Steps

Once everything is set up, you can:
- Add sales through the form
- Print bills
- View daily totals
- Check sales history
- The system will automatically reset daily at midnight

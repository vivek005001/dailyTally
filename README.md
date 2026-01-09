# Shop Daily Dashboard

A modern, feature-rich daily sales dashboard for shop owners to manage sales, generate bills, and track revenue.

![Dashboard](https://img.shields.io/badge/Status-Ready-success)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)
![Database](https://img.shields.io/badge/Database-Supabase-green)

## ✨ Features

- 📝 **Sales Form**: Add multiple items with name, price, and quantity
- 🧮 **Real-time Calculation**: Automatic total calculation as you type
- 🖨️ **Bill Printing**: Generate and print professional receipts
- 📊 **Daily Dashboard**: Track today's sales and transaction count
- 📅 **Sales History**: View previous days' totals
- 🔄 **Auto Reset**: Automatically creates new daily records at midnight
- 🎨 **Modern UI**: Beautiful dark theme with glassmorphic design
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- A modern web browser
- A Supabase account (free tier works great)

### Installation

1. **Clone or download this repository**

2. **Set up Supabase database**
   - Follow the detailed instructions in [SETUP.md](SETUP.md)
   - Run the SQL schema to create tables
   - Get your project URL and API key

3. **Configure the application**
   - Open `config.js`
   - Replace placeholders with your Supabase credentials:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://your-project.supabase.co',
     anonKey: 'your-anon-key-here'
   };
   ```

4. **Run the application**
   ```bash
   # Option 1: Python
   python3 -m http.server 8000
   
   # Option 2: Node.js
   npx http-server
   
   # Option 3: Just open index.html in your browser
   ```

5. **Open in browser**
   - Visit `http://localhost:8000`
   - Start adding sales!

## 📁 Project Structure

```
Shop-Dashboard/
├── index.html          # Main application structure
├── styles.css          # Modern styling with animations
├── app.js              # Application logic and Supabase integration
├── config.js           # Supabase configuration
├── SETUP.md            # Detailed setup instructions
└── README.md           # This file
```

## 🎯 Usage

### Adding a Sale

1. Enter item details (name, price, quantity)
2. Click "Add Item" to add more items
3. Review the total amount
4. Click "Save & Print Bill"
5. Bill will be saved to database and print dialog opens

### Viewing Dashboard

- **Today's Summary**: Shows total sales and transaction count for current day
- **Sales History**: Displays previous days' sales records

### Printing Bills

- Bills are formatted for thermal or standard printers
- Use browser's print dialog (Ctrl/Cmd + P)
- Print preview shows formatted receipt

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with modern design patterns
- **Fonts**: Google Fonts (Inter)

## 📊 Database Schema

### `daily_sales` Table
Stores aggregated daily totals
- `id` - Unique identifier
- `date` - Date of sales
- `total_amount` - Total revenue for the day
- `created_at`, `updated_at` - Timestamps

### `sales_transactions` Table
Stores individual transactions
- `id` - Unique identifier
- `sale_date` - Transaction date
- `items` - JSON array of items
- `total_amount` - Transaction total
- `created_at` - Timestamp

## 🎨 Design Features

- **Dark Theme**: Easy on the eyes
- **Glassmorphism**: Modern blur effects
- **Smooth Animations**: Fade-ins and hover effects
- **Gradient Accents**: Eye-catching color scheme
- **Responsive Layout**: Adapts to all screen sizes
- **Print-Optimized**: Clean receipts for printing

## 🔒 Security Notes

The current setup uses public access for simplicity. For production:

1. Enable Supabase authentication
2. Implement user-specific Row Level Security policies
3. Add access controls per user/shop
4. Use environment variables for sensitive data

## 🐛 Troubleshooting

**Issue**: Dashboard doesn't load
- Check browser console for errors
- Verify Supabase credentials in `config.js`
- Ensure database tables are created

**Issue**: Print doesn't work
- Check browser allows pop-ups/print dialogs
- Some browsers require user interaction first

**Issue**: Data not saving
- Verify Supabase project is active
- Check RLS policies are set correctly
- Review browser network tab for API errors

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please check the [SETUP.md](SETUP.md) guide first.

---

**Built with ❤️ for shop owners everywhere**

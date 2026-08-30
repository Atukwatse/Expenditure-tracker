# 💰 Expenditure Tracker

A mobile-friendly web app for tracking personal and business income and expenses. Perfect for small traders, boda riders, and anyone managing daily finances in Uganda.

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards**: Quick view of total income, expenses, and net profit/loss
- **Recent Transactions**: Latest 10 transactions at a glance
- **Analytics**: Visual charts showing spending patterns

### 💳 Transaction Management
- **Quick Add**: Floating action button (+) to add transactions instantly
- **Transaction Types**: Income and Expense modes
- **Categories**: 
  - Income: Salary, Stock, Sales
  - Expense: Transport, Rent, Food, Utilities, Other
- **Timestamps**: Auto-recorded with custom date selection
- **Delete**: Remove transactions with confirmation

### 📈 Analytics & Reports
- **Category Breakdown**: Pie charts showing where money goes
- **Daily Trends**: 7-day bar chart comparing income vs expenses
- **Net Profit/Loss**: Visualization of your financial health

### 📝 Transaction History
- **Full History**: Browse all transactions ever recorded
- **Grouped by Date**: Organized chronologically
- **Color-coded**: Easy identification by category and type

### 💾 Data Persistence
- **Offline Storage**: Uses browser localStorage - no cloud needed
- **Automatic Save**: Every transaction saves instantly
- **Data Export-ready**: All data stored in JSON format

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Visit: http://localhost:5173/
```

### Building for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

### Deployment Options

**Option 1: Static Hosting (Free)**
- Netlify, Vercel, GitHub Pages
- No backend needed - all data stored locally

**Option 2: Web Server**
```bash
# Build and serve
npm run build
# Serve the `dist` folder with any web server
```

**Option 3: Mobile App (Optional)**
- Convert to PWA (Progressive Web App) - works offline
- Wrap with Capacitor/Tauri for native iOS/Android app

## 📖 How to Use

### Adding a Transaction

1. Tap the **blue (+) button** at bottom-right
2. Select **Income** or **Expense**
3. Enter amount (in UGX)
4. Choose category
5. Add description (e.g., "Lunch", "Transport to market")
6. Select date (defaults to today)
7. Tap **"Add Income/Expense"**

### Viewing Analytics
- Tap **Analytics** tab
- See pie charts for category breakdown
- View 7-day trend chart

### Viewing All Transactions
- Tap **History** tab
- Scroll through all past transactions
- Delete transactions with trash icon

## 💱 Currency & Formatting

The app uses **UGX (Uganda Shilling)** formatting by default. To change:

1. Edit `src/components/Summary.tsx`
2. Change `currency: 'UGX'` to your currency code
3. Change locale if needed

**Example currencies:**
- USD: `currency: 'USD', locale: 'en-US'`
- GBP: `currency: 'GBP', locale: 'en-GB'`
- KES: `currency: 'KES', locale: 'en-KE'`

## 📁 Project Structure

```
src/
├── components/                 # React components
│   ├── TransactionForm.tsx     # Add transactions modal
│   ├── Summary.tsx             # Summary cards
│   ├── TransactionList.tsx     # Transaction history
│   └── Charts.tsx              # Analytics charts
├── styles/                     # Component CSS
│   ├── Summary.css
│   ├── TransactionForm.css
│   ├── TransactionList.css
│   └── Charts.css
├── hooks.ts                    # Custom React hooks for state management
├── types.ts                    # TypeScript type definitions
├── App.tsx                     # Main app component
├── App.css                     # Global app styles
├── main.tsx                    # React entry point
└── index.css                   # Base styles
```

## 🛠️ Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety and better DX
- **Vite**: Lightning-fast build tool
- **Recharts**: Charts and graphs
- **Lucide React**: Beautiful icons
- **date-fns**: Date manipulation
- **CSS3**: Responsive design

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 13+)
- ✅ All modern mobile browsers

## 📱 Mobile Optimization

- 🎯 Fully responsive design
- 🖱️ Touch-optimized buttons
- ⚡ Fast load times
- 🔋 Minimal data usage
- 📴 Works offline (data stored locally)
- 🔒 No internet required

## 💡 Tips for Users

### Daily Use
- Add transactions immediately after spending
- Use descriptive names for better tracking
- Review summary weekly

### For Business
- Categorize income sources separately
- Track overhead (rent, utilities) monthly
- Use analytics to identify spending patterns

### Data Management
- **Backup**: Manually export localStorage data periodically
- **Reset**: Clear browser data to delete all transactions
- **Export**: Copy JSON from browser DevTools → Application → LocalStorage

## 🔧 Development

### Adding New Categories

1. Edit `src/types.ts` - update `Category` type
2. Edit `src/components/TransactionForm.tsx` - add to `CATEGORIES` array
3. Update color mapping in `src/components/TransactionList.tsx`

### Customizing Colors

Edit `:root` variables in `src/App.css`:
```css
:root {
  --primary-color: #3b82f6;     /* Main blue */
  --success-color: #10b981;     /* Green for income */
  --danger-color: #ef4444;      /* Red for expenses */
  --warning-color: #f59e0b;     /* Yellow/orange */
  /* ... more colors */
}
```

### Adding More Features

Common additions:
- 📅 Monthly reports
- 💰 Budget limits
- 📸 Receipt photo upload
- 🌍 Multi-currency support
- 🌙 Dark mode
- ☁️ Cloud sync

## 🐛 Troubleshooting

### "Data not saving"
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check browser quota (usually 5-10MB)

### "Charts not showing"
- Refresh the page
- Check browser console (F12) for errors
- Ensure transactions exist for the date range

### "App is slow"
- Delete old transactions to reduce data size
- Restart browser
- Check internet connection (for PWA mode)

## 📊 Example Use Cases

### Small Shop Owner
- Track daily sales (income)
- Monitor supplier payments (expense)
- Identify best-selling days
- Calculate daily profit

### Boda Rider
- Log daily fares (income)
- Track fuel costs (expense)
- Monitor earnings per week
- Budget for bike maintenance

### Student Side Hustle
- Track tutoring earnings
- Monitor supply costs
- Calculate weekly profit
- Plan for bigger purchases

### Freelancer
- Log client payments
- Track project expenses
- Monitor monthly income
- Visualize cash flow

## 📈 Next Steps

After setup, consider:
1. Add your first transaction
2. Explore the Analytics tab
3. Customize categories for your needs
4. Set up a weekly review routine
5. Consider deploying to a hosting service

## 🚀 Deployment

### Deploy to Netlify (Easiest)
```bash
npm run build
# Drag & drop `dist` folder to Netlify
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to GitHub Pages
```bash
npm run build
# Push `dist` folder to gh-pages branch
```

## 📝 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- [ ] Cloud backup (Firebase/Supabase)
- [ ] Multi-device sync
- [ ] Advanced filtering & search
- [ ] Recurring transactions
- [ ] Budget goals & alerts
- [ ] Email/SMS reports
- [ ] Dark mode
- [ ] Internationalization

## 💬 Support

**Having issues?**
1. Check browser console (Press F12, go to Console tab)
2. Clear cache: Settings → Storage → Clear All
3. Try a different browser
4. Check internet connection

**Questions?**
- Review README sections above
- Check your browser's localStorage (DevTools → Application)
- Verify transaction date format (YYYY-MM-DD)

---

**Made with ❤️ for financial freedom**

Track your money. Track your growth. 💪

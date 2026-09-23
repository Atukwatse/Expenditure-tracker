import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { useTransactions } from './hooks';
import { TransactionForm } from './components/TransactionForm';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { AdvancedTools } from './components/AdvancedTools';
import { WalletCards } from 'lucide-react';
import './App.css';

function App() {
  const { transactions, isLoading, addTransaction, deleteTransaction } = useTransactions();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'monthly'>('overview');

  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const years = transactions.map((transaction) => new Date(parseISO(transaction.date)).getFullYear());
    const earliestYear = years.length > 0 ? Math.min(...years) : currentYear - 5;
    const latestYear = years.length > 0 ? Math.max(...years) : currentYear + 1;

    const startYear = Math.min(earliestYear, currentYear - 5);
    const endYear = Math.max(latestYear, currentYear + 1);

    const options: number[] = [];
    for (let year = startYear; year <= endYear; year += 1) {
      options.push(year);
    }

    return options;
  }, [transactions]);

  const monthOptions = useMemo(() => {
    const options: string[] = [];
    const cursor = new Date(selectedYear, 0, 1);

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      options.push(format(cursor, 'yyyy-MM'));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return options;
  }, [selectedYear]);

  useEffect(() => {
    if (!yearOptions.includes(selectedYear)) {
      setSelectedYear(yearOptions[yearOptions.length - 1] ?? new Date().getFullYear());
    }
  }, [yearOptions, selectedYear]);

  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(`${selectedYear}-01`);
    }
  }, [monthOptions, selectedMonth, selectedYear]);

  const monthDateRange = useMemo(() => {
    const currentMonth = new Date(`${selectedMonth}-01T00:00:00`);
    return {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    };
  }, [selectedMonth]);

  const monthlyTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const transactionDate = parseISO(transaction.date);
        return (
          transactionDate >= monthDateRange.start &&
          transactionDate <= monthDateRange.end
        );
      }),
    [transactions, monthDateRange]
  );

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <div className="brand-mark" aria-hidden="true">
              <WalletCards size={30} strokeWidth={2.25} />
            </div>
            <h1>
              <span>Expenditure</span> Tracker
            </h1>
          </div>
          <p className="subtitle">Monthly income, expenses, and profit tracker</p>
        </div>
      </header>

      <main className="app-main">
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
        </nav>

        {activeTab === 'overview' && (
          <div className="tab-content">
            <AdvancedTools transactions={transactions} onFilteredTransactions={setFilteredTransactions} />
            <Summary transactions={transactions} />
            <h2>Recent Transactions</h2>
            <TransactionList
              transactions={transactions.slice(0, 10)}
              onDelete={deleteTransaction}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-content">
            <AdvancedTools transactions={transactions} onFilteredTransactions={setFilteredTransactions} />
            <h2>All Transactions</h2>
            <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="tab-content">
            <div className="month-selector-card">
              <div className="selector-row">
                <div className="selector-group">
                  <label htmlFor="year-select">Select year</label>
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(Number(event.target.value))}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="selector-group">
                  <label htmlFor="month-select">Select month</label>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                  >
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {format(new Date(`${month}-01T00:00:00`), 'MMMM yyyy')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Summary transactions={monthlyTransactions} dateRange={monthDateRange} />

            <div className="monthly-summary-header">
              <h2>{format(new Date(`${selectedMonth}-01T00:00:00`), 'MMMM yyyy')} Summary</h2>
            </div>

            <TransactionList transactions={monthlyTransactions} onDelete={deleteTransaction} />
          </div>
        )}
      </main>

      <TransactionForm onSubmit={addTransaction} />
    </div>
  );
}

export default App;

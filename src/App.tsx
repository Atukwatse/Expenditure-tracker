import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { useTransactions } from './hooks';
import { TransactionForm } from './components/TransactionForm';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { BarChart3 } from 'lucide-react';
import './App.css';

function App() {
  const { transactions, isLoading, addTransaction, deleteTransaction } = useTransactions();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'monthly'>('overview');

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Set(
      transactions
        .map((transaction) => format(parseISO(transaction.date), 'yyyy-MM'))
        .filter(Boolean)
    );

    return Array.from(uniqueMonths).sort((a, b) => new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime());
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    if (monthOptions.length === 0) {
      setSelectedMonth(format(new Date(), 'yyyy-MM'));
      return;
    }

    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[monthOptions.length - 1]);
    }
  }, [monthOptions, selectedMonth]);

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
            <BarChart3 size={28} />
            <h1>Expenditure Tracker</h1>
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
            <h2>All Transactions</h2>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="tab-content">
            <div className="month-selector-card">
              <label htmlFor="month-select">Select month</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {monthOptions.length > 0 ? (
                  monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {format(new Date(`${month}-01T00:00:00`), 'MMMM yyyy')}
                    </option>
                  ))
                ) : (
                  <option value={selectedMonth}>
                    {format(new Date(`${selectedMonth}-01T00:00:00`), 'MMMM yyyy')}
                  </option>
                )}
              </select>
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

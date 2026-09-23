import { useMemo, useState } from 'react';
import { addMonths, format, parseISO, startOfMonth } from 'date-fns';
import { BarChart3, Download, Search, Target, TrendingUp } from 'lucide-react';
import type { Category, Transaction } from '../types';
import '../styles/AdvancedTools.css';

const categories: Category[] = ['salary', 'stock', 'sales', 'transport', 'rent', 'food', 'utilities', 'other'];
const money = (value: number) => value.toLocaleString('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 });

interface AdvancedToolsProps {
  transactions: Transaction[];
  onFilteredTransactions: (transactions: Transaction[]) => void;
}

export const AdvancedTools = ({ transactions, onFilteredTransactions }: AdvancedToolsProps) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [budget, setBudget] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const result = transactions.filter((transaction) => {
      const matchesQuery = `${transaction.description} ${transaction.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (type === 'all' || transaction.type === type);
    });
    onFilteredTransactions(result);
    return result;
  }, [transactions, query, type, onFilteredTransactions]);

  const currentMonth = startOfMonth(new Date());
  const monthExpenses = transactions.filter((transaction) => transaction.type === 'expense' && parseISO(transaction.date) >= currentMonth);
  const totalMonthExpenses = monthExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const previousMonth = addMonths(currentMonth, -1);
  const previousExpenses = transactions
    .filter((transaction) => transaction.type === 'expense' && parseISO(transaction.date) >= previousMonth && parseISO(transaction.date) < currentMonth)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const change = previousExpenses ? ((totalMonthExpenses - previousExpenses) / previousExpenses) * 100 : 0;

  const exportCsv = () => {
    const rows = [['Date', 'Type', 'Category', 'Description', 'Amount'], ...filtered.map((transaction) => [
      transaction.date, transaction.type, transaction.category, transaction.description, String(transaction.amount),
    ])];
    const blob = new Blob([rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenditure-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="advanced-tools">
      <div className="advanced-header">
        <div>
          <p className="eyebrow">Advanced controls</p>
          <h2>Plan, analyze, and export</h2>
        </div>
        <button className="export-btn" onClick={exportCsv}><Download size={16} /> Export CSV</button>
      </div>
      <div className="tool-grid">
        <div className="tool-card">
          <div className="tool-card-title"><Search size={18} /><strong>Smart filters</strong></div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search description or category" />
          <select value={type} onChange={(event) => setType(event.target.value as typeof type)}>
            <option value="all">All transactions</option><option value="income">Income only</option><option value="expense">Expenses only</option>
          </select>
          <span className="muted">{filtered.length} matching transaction{filtered.length === 1 ? '' : 's'}</span>
        </div>
        <div className="tool-card">
          <div className="tool-card-title"><TrendingUp size={18} /><strong>Monthly insight</strong></div>
          <strong className={change > 0 ? 'danger-text' : 'success-text'}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</strong>
          <span className="muted">expense change vs last month</span>
          <span className="insight-value">{money(totalMonthExpenses)} this month</span>
        </div>
        <div className="tool-card budget-card">
          <div className="tool-card-title"><Target size={18} /><strong>Category budgets</strong></div>
          {categories.filter((category) => category !== 'salary' && category !== 'stock' && category !== 'sales').map((category) => {
            const spent = monthExpenses.filter((transaction) => transaction.category === category).reduce((sum, transaction) => sum + transaction.amount, 0);
            const limit = Number(budget[category] || 0);
            const percentage = limit ? Math.min((spent / limit) * 100, 100) : 0;
            return <div className="budget-row" key={category}><div><span>{category}</span><small>{money(spent)}{limit ? ` / ${money(limit)}` : ''}</small></div><input type="number" min="0" placeholder="Set limit" value={budget[category] || ''} onChange={(event) => setBudget({ ...budget, [category]: event.target.value })} /><div className="progress"><span className={percentage >= 100 ? 'over-budget' : ''} style={{ width: `${percentage}%` }} /></div></div>;
          })}
        </div>
        <div className="tool-card analytics-card">
          <div className="tool-card-title"><BarChart3 size={18} /><strong>Spending breakdown</strong></div>
          {categories.map((category) => {
            const total = monthExpenses.filter((transaction) => transaction.category === category).reduce((sum, transaction) => sum + transaction.amount, 0);
            return <div className="bar-row" key={category}><span>{category}</span><div className="bar"><span style={{ width: `${totalMonthExpenses ? (total / totalMonthExpenses) * 100 : 0}%` }} /></div><small>{money(total)}</small></div>;
          })}
        </div>
      </div>
    </section>
  );
};

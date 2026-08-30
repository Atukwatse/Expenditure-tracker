import type { Transaction } from '../types';
import { format, parseISO } from 'date-fns';
import { Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import '../styles/TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    salary: '#10b981',
    stock: '#3b82f6',
    sales: '#f59e0b',
    transport: '#8b5cf6',
    rent: '#ef4444',
    food: '#ec4899',
    utilities: '#06b6d4',
    other: '#6b7280',
  };
  return colors[category] || '#6b7280';
};

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  // Group transactions by date
  const groupedByDate = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    if (!groupedByDate.has(tx.date)) {
      groupedByDate.set(tx.date, []);
    }
    groupedByDate.get(tx.date)!.push(tx);
  });

  const sortedDates = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="transaction-list">
      {sortedDates.map((date) => (
        <div key={date} className="transaction-group">
          <h3 className="date-header">{format(parseISO(date), 'EEEE, MMM d, yyyy')}</h3>
          <div className="transactions">
            {groupedByDate.get(date)!.map((tx) => (
              <div
                key={tx.id}
                className={`transaction-item ${tx.type}`}
                style={{ borderLeftColor: getCategoryColor(tx.category) }}
              >
                <div className="transaction-icon">
                  {tx.type === 'income' ? (
                    <ArrowDownLeft size={20} style={{ color: getCategoryColor(tx.category) }} />
                  ) : (
                    <ArrowUpRight size={20} style={{ color: getCategoryColor(tx.category) }} />
                  )}
                </div>

                <div className="transaction-details">
                  <div className="transaction-header">
                    <span className="category-badge" style={{ backgroundColor: getCategoryColor(tx.category) }}>
                      {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                    </span>
                    <span className={`amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}{' '}
                      {tx.amount.toLocaleString('en-UG', {
                        style: 'currency',
                        currency: 'UGX',
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <p className="description">{tx.description}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this transaction?')) {
                      onDelete(tx.id);
                    }
                  }}
                  title="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

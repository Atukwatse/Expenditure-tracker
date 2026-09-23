import { useState } from 'react';
import type { Transaction, Category, TransactionType } from '../types';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import '../styles/TransactionForm.css';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Salary', value: 'salary' },
  { label: 'Stock', value: 'stock' },
  { label: 'Sales', value: 'sales' },
  { label: 'Transport', value: 'transport' },
  { label: 'Rent', value: 'rent' },
  { label: 'Food', value: 'food' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Other', value: 'other' },
];

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !description) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      recurring,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setType('expense');
    setCategory('other');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setRecurring(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button className="fab" onClick={() => setIsOpen(true)} title="Add transaction">
        <Plus size={24} />
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Transaction</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Type Selection */}
          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`toggle-btn ${type === 'expense' ? 'active' : ''}`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`toggle-btn ${type === 'income' ? 'active' : ''}`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount (UGX)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Bus fare to work"
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(event) => setRecurring(event.target.checked)}
            />
            Repeat monthly for the next 6 months
          </label>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

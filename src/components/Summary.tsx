import type { Transaction } from '../types';
import { useSummaries } from '../hooks';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import '../styles/Summary.css';

interface SummaryProps {
  transactions: Transaction[];
  dateRange?: { start: Date; end: Date };
}

export const Summary = ({ transactions, dateRange }: SummaryProps) => {
  const { getOverallSummary } = useSummaries(transactions, dateRange);
  const summary = getOverallSummary();

  return (
    <div className="summary">
      <div className="summary-card income-card">
        <div className="card-header">
          <span className="card-label">Total Income</span>
          <TrendingUp className="card-icon" size={20} />
        </div>
        <div className="card-value">
          {summary.totalIncome.toLocaleString('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0,
          })}
        </div>
      </div>

      <div className="summary-card expense-card">
        <div className="card-header">
          <span className="card-label">Total Expense</span>
          <TrendingDown className="card-icon" size={20} />
        </div>
        <div className="card-value">
          {summary.totalExpense.toLocaleString('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0,
          })}
        </div>
      </div>

      <div className={`summary-card profit-card ${summary.netProfit >= 0 ? 'positive' : 'negative'}`}>
        <div className="card-header">
          <span className="card-label">Net Profit/Loss</span>
          <DollarSign className="card-icon" size={20} />
        </div>
        <div className="card-value">
          {summary.netProfit.toLocaleString('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0,
          })}
        </div>
      </div>
    </div>
  );
};

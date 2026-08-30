import type { Transaction } from '../types';
import { useSummaries } from '../hooks';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Charts.css';

interface ChartsProps {
  transactions: Transaction[];
  dateRange?: { start: Date; end: Date };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4', '#6b7280'];

export const Charts = ({ transactions, dateRange }: ChartsProps) => {
  const { getCategorySummaries, getDailySummaries } = useSummaries(transactions, dateRange);

  const expenseSummary = getCategorySummaries('expense');
  const incomeSummary = getCategorySummaries('income');
  const dailySummaries = getDailySummaries();

  const expenseData = expenseSummary.map((item) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.total,
  }));

  const incomeData = incomeSummary.map((item) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.total,
  }));

  const dailyData = dailySummaries.slice(0, 7).reverse().map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-UG', { month: 'short', day: 'numeric' }),
    income: item.totalIncome,
    expense: item.totalExpense,
    profit: item.netProfit,
  }));

  return (
    <div className="charts-container">
      <div className="charts-section">
        <h3>Expenses by Category</h3>
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${Math.round((entry.value / expenseData.reduce((sum, d) => sum + d.value, 0)) * 100)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                  const rawValue = Array.isArray(value) ? value[0] : value;
                  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
                  return numericValue.toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>

      <div className="charts-section">
        <h3>Income by Category</h3>
        {incomeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${Math.round((entry.value / incomeData.reduce((sum, d) => sum + d.value, 0)) * 100)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                  const rawValue = Array.isArray(value) ? value[0] : value;
                  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
                  return numericValue.toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No income data available</p>
        )}
      </div>

      <div className="charts-section full-width">
        <h3>Daily Trend (Last 7 Days)</h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                  const rawValue = Array.isArray(value) ? value[0] : value;
                  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
                  return numericValue.toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" />
              <Bar dataKey="expense" fill="#ef4444" />
              <Bar dataKey="profit" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No daily data available</p>
        )}
      </div>
    </div>
  );
};

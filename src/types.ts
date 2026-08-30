export type TransactionType = 'income' | 'expense';
export type Category = 'salary' | 'stock' | 'transport' | 'sales' | 'rent' | 'food' | 'utilities' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number; // For sorting
}

export interface DailySummary {
  date: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
  type: TransactionType;
}

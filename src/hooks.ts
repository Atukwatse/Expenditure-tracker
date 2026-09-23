import { useState, useEffect, useCallback } from 'react';
import type { Transaction, DailySummary, CategorySummary } from './types';
import { addMonths, format, startOfDay, endOfDay, isAfter, isBefore, parseISO } from 'date-fns';

const STORAGE_KEY = 'expenditure_tracker_data';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const entries: Transaction[] = Array.from({ length: transaction.recurring ? 6 : 1 }, (_, index) => {
      const date = addMonths(parseISO(transaction.date), index);
      return {
        ...transaction,
        date: format(date, 'yyyy-MM-dd'),
        id: crypto.randomUUID(),
        timestamp: Date.now() + index,
      };
    });
    setTransactions((prev) => [...entries.reverse(), ...prev]);
    return entries[entries.length - 1];
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  return { transactions, isLoading, addTransaction, deleteTransaction, editTransaction };
};

export const useSummaries = (transactions: Transaction[], dateRange?: { start: Date; end: Date }) => {
  return {
    getDailySummaries: useCallback((): DailySummary[] => {
      const summariesMap = new Map<string, DailySummary>();

      const filtered = dateRange
        ? transactions.filter((t) => {
            const txDate = parseISO(t.date);
            return isAfter(txDate, startOfDay(dateRange.start)) && isBefore(txDate, endOfDay(dateRange.end));
          })
        : transactions;

      filtered.forEach((tx) => {
        const existing = summariesMap.get(tx.date) || {
          date: tx.date,
          totalIncome: 0,
          totalExpense: 0,
          netProfit: 0,
        };

        if (tx.type === 'income') {
          existing.totalIncome += tx.amount;
        } else {
          existing.totalExpense += tx.amount;
        }

        existing.netProfit = existing.totalIncome - existing.totalExpense;
        summariesMap.set(tx.date, existing);
      });

      return Array.from(summariesMap.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }, [transactions, dateRange]),

    getCategorySummaries: useCallback(
      (type: 'income' | 'expense'): CategorySummary[] => {
        const summariesMap = new Map<string, CategorySummary>();

        const filtered = dateRange
          ? transactions.filter((t) => {
              const txDate = parseISO(t.date);
              return (
                t.type === type &&
                isAfter(txDate, startOfDay(dateRange.start)) &&
                isBefore(txDate, endOfDay(dateRange.end))
              );
            })
          : transactions.filter((t) => t.type === type);

        filtered.forEach((tx) => {
          const key = tx.category;
          const existing = summariesMap.get(key) || {
            category: tx.category,
            total: 0,
            count: 0,
            type,
          };

          existing.total += tx.amount;
          existing.count += 1;
          summariesMap.set(key, existing);
        });

        return Array.from(summariesMap.values()).sort((a, b) => b.total - a.total);
      },
      [transactions, dateRange]
    ),

    getOverallSummary: useCallback(() => {
      const filtered = dateRange
        ? transactions.filter((t) => {
            const txDate = parseISO(t.date);
            return isAfter(txDate, startOfDay(dateRange.start)) && isBefore(txDate, endOfDay(dateRange.end));
          })
        : transactions;

      const totalIncome = filtered.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        transactionCount: filtered.length,
      };
    }, [transactions, dateRange]),
  };
};

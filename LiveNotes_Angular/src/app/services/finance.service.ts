import { computed, Injectable, signal } from '@angular/core';

export interface Transaction {
  id: number;
  name: string;
  category: string;
  categoryKey: 'entertainment' | 'housing' | 'work' | 'food' | 'untracked';
  date: Date;
  amount: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  saved: number;
  target: number;
  color: string;
}

export interface BudgetCategory {
  id: number;
  name: string;
  categoryKey: Transaction['categoryKey'];
  budget: number;
  color: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  saved: number;
}

export interface Deposit {
  id: number;
  goalName: string;
  date: Date;
  amount: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  readonly transactions = signal<Transaction[]>([
    { id: 1, name: 'Spotify',          category: 'Ocio',       categoryKey: 'entertainment', date: new Date(2026, 2, 7),  amount: -10 },
    { id: 2, name: 'Alquiler',         category: 'Vivienda',   categoryKey: 'housing',       date: new Date(2026, 2, 8),  amount: -400 },
    { id: 3, name: 'Cena de ayer',     category: 'Comida',     categoryKey: 'food',          date: new Date(2026, 2, 8),  amount: -18.8 },
    { id: 4, name: 'Gasto sin trazar', category: 'Sin trazar', categoryKey: 'untracked',     date: new Date(2026, 2, 5),  amount: -25 },
    { id: 5, name: 'Nómina',           category: 'Trabajo',    categoryKey: 'work',          date: new Date(2026, 2, 5),  amount: 3250 },
    { id: 6, name: 'Netflix',          category: 'Ocio',       categoryKey: 'entertainment', date: new Date(2026, 2, 3),  amount: -15.99 },
    { id: 7, name: 'Supermercado',     category: 'Comida',     categoryKey: 'food',          date: new Date(2026, 2, 10), amount: -87.5 },
    { id: 8, name: 'Gym',              category: 'Ocio',       categoryKey: 'entertainment', date: new Date(2026, 2, 1),  amount: -40 },
  ]);

  readonly savingsGoals = signal<SavingsGoal[]>([
    { id: 1, name: 'Fondo emergencia', saved: 1200, target: 3000,  color: 'var(--purple)' },
    { id: 2, name: 'Vacaciones',       saved: 350,  target: 600,   color: 'var(--green)' },
    { id: 3, name: 'Portátil nuevo',   saved: 480,  target: 1500,  color: 'var(--red)' },
    { id: 4, name: 'Jubilación',       saved: 2100, target: 10000, color: 'var(--accent-color)' },
  ]);

  readonly budgetCategories = signal<BudgetCategory[]>([
    { id: 1, name: 'Alimentación', categoryKey: 'food',          budget: 500, color: 'var(--green)' },
    { id: 2, name: 'Vivienda',     categoryKey: 'housing',       budget: 400, color: 'var(--blue)' },
    { id: 3, name: 'Ocio',         categoryKey: 'entertainment', budget: 100, color: 'var(--purple)' },
  ]);

  readonly monthlyStats = signal<MonthlyStats[]>([
    { month: 'Jul', income: 3200, expenses: 2800, saved: 400 },
    { month: 'Aug', income: 3250, expenses: 2700, saved: 550 },
    { month: 'Sep', income: 3250, expenses: 2600, saved: 650 },
    { month: 'Oct', income: 3100, expenses: 2900, saved: 200 },
    { month: 'Nov', income: 3250, expenses: 3000, saved: 250 },
    { month: 'Dec', income: 3400, expenses: 2500, saved: 900 },
    { month: 'Jan', income: 3250, expenses: 2850, saved: 400 },
    { month: 'Feb', income: 3250, expenses: 2900, saved: 350 },
  ]);

  readonly recentDeposits = signal<Deposit[]>([
    { id: 1, goalName: 'Fondo emergencia', date: new Date(2025, 10, 4), amount: 80 },
    { id: 2, goalName: 'Vacaciones',       date: new Date(2025, 10, 4), amount: 50 },
    { id: 3, goalName: 'Fondo emergencia', date: new Date(2025, 10, 6), amount: 200 },
  ]);

  readonly categorySpending = computed(() => {
    const txs = this.transactions();
    return this.budgetCategories().map(cat => {
      const spent = txs
        .filter(t => t.categoryKey === cat.categoryKey && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { ...cat, spent };
    });
  });

  readonly totalSaved = computed(() =>
    this.savingsGoals().reduce((sum, g) => sum + g.saved, 0)
  );

  readonly totalTarget = computed(() =>
    this.savingsGoals().reduce((sum, g) => sum + g.target, 0)
  );

  readonly totalProgress = computed(() =>
    Math.round((this.totalSaved() / this.totalTarget()) * 100)
  );

  readonly avgMonthlySaved = computed(() => {
    const stats = this.monthlyStats();
    if (!stats.length) return 0;
    return stats.reduce((sum, s) => sum + s.saved, 0) / stats.length;
  });

  addTransaction(data: Omit<Transaction, 'id'>): void {
    const ids = this.transactions().map(t => t.id);
    const newId = ids.length ? Math.max(...ids) + 1 : 1;
    this.transactions.update(txs => [{ ...data, id: newId }, ...txs]);
  }
}

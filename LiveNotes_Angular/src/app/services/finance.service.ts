import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Frontend interfaces (used by components) ────────────────────────────────

export interface Transaction {
  id: string;
  name: string;
  category: string;
  categoryKey: 'entertainment' | 'housing' | 'work' | 'food' | 'untracked';
  date: Date;
  amount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  saved: number;
  target: number;
  color: string;
  movimientos?: { fecha: string; importe: number }[];
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

// ── Backend response shapes ──────────────────────────────────────────────────

interface ApiCategoria {
  _id: string;
  nombre: string;
  color?: string;
}

interface ApiMovimiento {
  _id: string;
  name: string;
  fecha: string;
  tipo: boolean;
  importe: number;
  categorias: ApiCategoria[];
}

interface ApiMeta {
  _id: string;
  name: string;
  meta: number;
  acumulado: number;
  completada: boolean;
  movimientos: { fecha: string; importe: number }[];
}

export interface ApiMovimientoDto {
  name: string;
  fecha: string;
  tipo: boolean;
  importe: number;
  cuenta: string;
  destinatario?: string;
  metodo?: 'Transferencia' | 'Tarjeta' | 'Factura' | 'Subscripcion' | 'Bizum' | 'Efectivo' | 'Otro';
  metaId?: string;
  categorias?: string[];
}

export interface ApiMetaDto {
  name: string;
  meta: number;
  acumulado?: number;
}

// ── Goal colors cycle ────────────────────────────────────────────────────────

const GOAL_COLORS = [
  'var(--purple)', 'var(--green)', 'var(--red)',
  'var(--accent-color)', 'var(--blue)',
];

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly http = inject(HttpClient);
  private readonly baseMovimientos = `${environment.apiUrl}/movimientos`;
  private readonly baseMetas = `${environment.apiUrl}/metas`;

  // ── Signals ────────────────────────────────────────────────────────────────

  readonly transactions = signal<Transaction[]>([]);
  readonly savingsGoals = signal<SavingsGoal[]>([]);
  readonly budgetCategories = signal<BudgetCategory[]>([]);

  private _txLoaded = false;
  private _goalsLoaded = false;

  // ── Computed ───────────────────────────────────────────────────────────────

  readonly monthlyStats = computed<MonthlyStats[]>(() => {
    const txs = this.transactions();
    const map = new Map<string, { income: number; expenses: number; year: number; monthNum: number }>();

    for (const tx of txs) {
      const d = tx.date;
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { income: 0, expenses: 0, year: d.getFullYear(), monthNum: d.getMonth() });
      }
      const entry = map.get(key)!;
      if (tx.amount > 0) entry.income += tx.amount;
      else entry.expenses += Math.abs(tx.amount);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, { income, expenses, year, monthNum }]) => ({
        month: new Date(year, monthNum).toLocaleString('en-US', { month: 'short' }),
        income,
        expenses,
        saved: income - expenses,
      }));
  });

  readonly recentDeposits = computed<Deposit[]>(() => {
    let autoId = 0;
    return this.savingsGoals()
      .flatMap(g =>
        (g.movimientos ?? []).map(m => ({
          id: autoId++,
          goalName: g.name,
          date: new Date(m.fecha),
          amount: m.importe,
        }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  });

  readonly totalSaved = computed(() =>
    this.savingsGoals().reduce((sum, g) => sum + g.saved, 0)
  );

  readonly totalTarget = computed(() =>
    this.savingsGoals().reduce((sum, g) => sum + g.target, 0)
  );

  readonly totalProgress = computed(() => {
    const target = this.totalTarget();
    return target ? Math.round((this.totalSaved() / target) * 100) : 0;
  });

  readonly avgMonthlySaved = computed(() => {
    const stats = this.monthlyStats();
    if (!stats.length) return 0;
    return stats.reduce((sum, s) => sum + s.saved, 0) / stats.length;
  });

  readonly categorySpending = computed(() => {
    const txs = this.transactions();
    return this.budgetCategories().map(cat => {
      const spent = txs
        .filter(t => t.categoryKey === cat.categoryKey && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { ...cat, spent };
    });
  });

  // ── HTTP: Movimientos ──────────────────────────────────────────────────────

  loadTransactions(): Observable<ApiMovimiento[]> {
    if (this._txLoaded) return of([]);
    this._txLoaded = true;
    return this.http.get<ApiMovimiento[]>(this.baseMovimientos).pipe(
      tap(data => this.transactions.set(data.map(m => this.mapToTransaction(m))))
    );
  }

  createMovimiento(dto: ApiMovimientoDto): Observable<ApiMovimiento> {
    return this.http.post<ApiMovimiento>(this.baseMovimientos, dto).pipe(
      tap(m => this.transactions.update(txs => [this.mapToTransaction(m), ...txs]))
    );
  }

  // ── HTTP: Metas ────────────────────────────────────────────────────────────

  loadSavingsGoals(): Observable<ApiMeta[]> {
    if (this._goalsLoaded) return of([]);
    this._goalsLoaded = true;
    return this.http.get<ApiMeta[]>(this.baseMetas).pipe(
      tap(data => this.savingsGoals.set(data.map((m, i) => this.mapToSavingsGoal(m, i))))
    );
  }

  createMeta(dto: ApiMetaDto): Observable<ApiMeta> {
    const colorIdx = this.savingsGoals().length % GOAL_COLORS.length;
    return this.http.post<ApiMeta>(this.baseMetas, dto).pipe(
      tap(m => this.savingsGoals.update(goals => [...goals, this.mapToSavingsGoal(m, colorIdx)]))
    );
  }

  updateMeta(id: string, dto: Partial<ApiMetaDto>): Observable<ApiMeta> {
    return this.http.put<ApiMeta>(`${this.baseMetas}/${id}`, dto).pipe(
      tap(updated => this.savingsGoals.update(goals =>
        goals.map(g => g.id === id ? this.mapToSavingsGoal(updated, goals.findIndex(x => x.id === id)) : g)
      ))
    );
  }

  deleteMeta(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseMetas}/${id}`).pipe(
      tap(() => this.savingsGoals.update(goals => goals.filter(g => g.id !== id)))
    );
  }

  // ── Local write helpers (used by components pending full API integration) ──

  addTransaction(data: Omit<Transaction, 'id'>): void {
    const tempId = `local-${Date.now()}`;
    this.transactions.update(txs => [{ ...data, id: tempId }, ...txs]);
  }

  depositToGoal(goalId: string, amount: number, name: string, date: Date): void {
    const goal = this.savingsGoals().find(g => g.id === goalId);
    if (!goal) return;

    this.savingsGoals.update(goals =>
      goals.map(g => g.id === goalId ? { ...g, saved: g.saved + amount } : g)
    );

    this.addTransaction({
      name,
      amount,
      date,
      categoryKey: 'work',
      category: `→ ${goal.name}`,
    });
  }

  // ── Mapping helpers ────────────────────────────────────────────────────────

  private mapToTransaction(m: ApiMovimiento): Transaction {
    const cat = m.categorias?.[0];
    return {
      id: m._id,
      name: m.name,
      category: cat?.nombre ?? 'Sin trazar',
      categoryKey: this.mapCategoryKey(cat?.nombre),
      date: new Date(m.fecha),
      amount: m.tipo ? m.importe : -m.importe,
    };
  }

  private mapToSavingsGoal(m: ApiMeta, colorIndex: number): SavingsGoal {
    return {
      id: m._id,
      name: m.name,
      saved: m.acumulado,
      target: m.meta,
      color: GOAL_COLORS[colorIndex % GOAL_COLORS.length],
      movimientos: m.movimientos,
    };
  }

  private mapCategoryKey(nombre?: string): Transaction['categoryKey'] {
    if (!nombre) return 'untracked';
    const n = nombre.toLowerCase();
    if (n.includes('ocio') || n.includes('entret') || n.includes('suscr')) return 'entertainment';
    if (n.includes('vivien') || n.includes('alquil') || n.includes('hous')) return 'housing';
    if (n.includes('trabaj') || n.includes('nómin') || n.includes('work') || n.includes('salari')) return 'work';
    if (n.includes('comid') || n.includes('aliment') || n.includes('food') || n.includes('super') || n.includes('restaur')) return 'food';
    return 'untracked';
  }
}

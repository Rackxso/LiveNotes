import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { TodoItem, TodoService } from '../../../services/todo.service';
import { I18nService } from '../../../services/i18n.service';
import { jumpingCat, balancedFlow, pilaScore, SortableTodo } from '../../../utils/sort-algorithms';

const PILA_BADGE_CLASS: Record<number, string> = {
  0: 'badge-critica',
  1: 'badge-alta',
  2: 'badge-media',
  3: 'badge-baja',
};

@Component({
  selector: 'app-task-sort-view',
  templateUrl: './task-sort-view.html',
  styleUrl: './task-sort-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSortView implements OnInit {
  private readonly todoService = inject(TodoService);
  readonly t = inject(I18nService).t;

  readonly tasks = input.required<TodoItem[]>();
  readonly cerrar = output<void>();
  readonly aplicado = output<string>();

  readonly localTasks = signal<TodoItem[]>([]);
  readonly previewOrder = signal<TodoItem[] | null>(null);
  readonly phase = signal<'setup' | 'preview'>('setup');
  readonly saving = signal(false);
  private lastAlgorithm = '';

  readonly pila0 = computed(() => this.localTasks().filter(t => t.importancia === 0));
  readonly pila1 = computed(() => this.localTasks().filter(t => t.importancia === 1));
  readonly pila2 = computed(() => this.localTasks().filter(t => t.importancia === 2));
  readonly pila3 = computed(() => this.localTasks().filter(t => t.importancia === 3));

  readonly pilas = computed(() => {
    const t = this.t();
    return [
      { label: t('todo.sort.critica'), tasks: this.pila0(), index: 0 },
      { label: t('todo.sort.alta'),    tasks: this.pila1(), index: 1 },
      { label: t('todo.sort.media'),   tasks: this.pila2(), index: 2 },
      { label: t('todo.sort.baja'),    tasks: this.pila3(), index: 3 },
    ];
  });

  ngOnInit(): void {
    this.localTasks.set(
      this.tasks().map(t => ({
        ...t,
        dificultad: t.dificultad ?? 3,
        importancia: t.importancia ?? 3,
      }))
    );
  }

  setImportancia(id: string, value: number): void {
    this.localTasks.update(tasks =>
      tasks.map(t => t._id === id ? { ...t, importancia: value } : t)
    );
  }

  setDificultad(id: string, value: number): void {
    const clamped = Math.max(1, Math.min(5, value));
    this.localTasks.update(tasks =>
      tasks.map(t => t._id === id ? { ...t, dificultad: clamped } : t)
    );
  }

  runJumpingCat(): void {
    this.lastAlgorithm = 'JumpingCat';
    this.runAlgorithm(jumpingCat);
  }

  runBalancedFlow(): void {
    this.lastAlgorithm = 'BalancedFlow';
    this.runAlgorithm(balancedFlow);
  }

  runPilaScore(): void {
    this.lastAlgorithm = 'PilaScore';
    this.runAlgorithm(pilaScore);
  }

  private runAlgorithm(fn: (tasks: SortableTodo[]) => SortableTodo[]): void {
    const sortable = this.localTasks().map(t => ({
      _id: t._id,
      importancia: t.importancia,
      dificultad: t.dificultad,
    }));
    const sorted = fn(sortable);
    const taskMap = new Map(this.localTasks().map(t => [t._id, t]));
    const ordered = sorted.map(s => taskMap.get(s._id)).filter((t): t is TodoItem => !!t);
    this.previewOrder.set(ordered);
    this.phase.set('preview');
  }

  confirmOrder(): void {
    const preview = this.previewOrder();
    if (!preview) return;
    this.saving.set(true);

    const original = this.tasks();
    const originalMap = new Map(original.map(t => [t._id, t]));

    const updateCalls = this.localTasks()
      .filter(t => {
        const orig = originalMap.get(t._id);
        return orig && (orig.dificultad !== t.dificultad || orig.importancia !== t.importancia);
      })
      .map(t => this.todoService.updateTodo(t._id, { dificultad: t.dificultad, importancia: t.importancia }));

    const reorderItems = preview.map((t, i) => ({ _id: t._id, order: i }));
    const reorderCall = this.todoService.reorderTodos(reorderItems);

    const calls = updateCalls.length > 0 ? [...updateCalls, reorderCall] : [reorderCall];

    forkJoin(calls).subscribe({
      next: () => {
        this.saving.set(false);
        this.aplicado.emit(this.lastAlgorithm);
        this.cerrar.emit();
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  backToSetup(): void {
    this.phase.set('setup');
    this.previewOrder.set(null);
  }

  pilaLabel(importancia: number): string {
    const keys: Record<number, string> = {
      0: 'todo.sort.critica',
      1: 'todo.sort.alta',
      2: 'todo.sort.media',
      3: 'todo.sort.baja',
    };
    return this.t()(keys[importancia] ?? 'todo.sort.baja');
  }

  pilaBadgeClass(importancia: number): string {
    return PILA_BADGE_CLASS[importancia] ?? 'badge-baja';
  }

  readonly importanciaOptions = computed(() => {
    const t = this.t();
    return [
      { value: 0, label: 'C', title: t('todo.sort.critica') },
      { value: 1, label: 'A', title: t('todo.sort.alta') },
      { value: 2, label: 'M', title: t('todo.sort.media') },
      { value: 3, label: 'B', title: t('todo.sort.baja') },
    ];
  });
}

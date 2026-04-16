import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-to-do',
  imports: [],
  templateUrl: './to-do.html',
  styleUrl: './to-do.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDo implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly searchQuery = input<string>('');
  readonly selectedList = signal<string>('all');

  readonly todos = this.todoService.todos;

  ngOnInit(): void {
    this.todoService.getTodos().subscribe();
  }

  readonly lists = computed(() => {
    const unique = [...new Set(this.todos().map(t => t.idLista))];
    return unique;
  });

  readonly filteredTodos = computed(() => {
    let items = this.todos();
    const list = this.selectedList();
    if (list !== 'all') {
      items = items.filter(t => t.idLista === list);
    }
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      items = items.filter(t => t.texto.toLowerCase().includes(q));
    }
    return items;
  });

  toggle(id: string): void {
    const todo = this.todos().find(t => t._id === id);
    if (!todo) return;
    this.todoService.updateTodo(id, { completado: !todo.completado }).subscribe();
  }

  formatDate(fechaLimite: string | null): string {
    if (!fechaLimite) return '';
    const date = new Date(fechaLimite);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  selectList(list: string): void {
    this.selectedList.set(list);
  }
}

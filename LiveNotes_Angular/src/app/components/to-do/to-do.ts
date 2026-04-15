import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  when: string;
}

@Component({
  selector: 'app-to-do',
  imports: [],
  templateUrl: './to-do.html',
  styleUrl: './to-do.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDo {
  readonly todos = signal<TodoItem[]>([
    { id: 1, text: 'Revisar propuesta del cliente',  done: false, when: 'Mañana' },
    { id: 2, text: 'Hacer gráficos de finanzas',      done: false, when: 'Hoy'    },
    { id: 3, text: 'Actualizar portfolio',             done: true,  when: 'Hoy'    },
    { id: 4, text: 'Comprar comida para la semana',   done: false, when: 'Mañana' },
    { id: 5, text: 'Llamar al médico',                done: true,  when: 'Hoy'    },
  ]);

  toggle(id: number): void {
    this.todos.update(items =>
      items.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }
}

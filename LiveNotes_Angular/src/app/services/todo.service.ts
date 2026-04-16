import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SubItem {
  _id: string;
  texto: string;
  completado: boolean;
  prioridad: number;
  fechaLimite: string | null;
  etiquetas: string[];
}

export interface TodoItem {
  _id: string;
  idLista: string;
  texto: string;
  completado: boolean;
  prioridad: number;
  fechaLimite: string | null;
  etiquetas: string[];
  subItems: SubItem[];
}

export interface TodoDto {
  idLista: string;
  texto: string;
  prioridad?: number;
  fechaLimite?: string;
  etiquetas?: string[];
}

export interface SubItemDto {
  texto: string;
  prioridad?: number;
  fechaLimite?: string;
  etiquetas?: string[];
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/todos`;

  private readonly _todos = signal<TodoItem[]>([]);
  readonly todos = this._todos.asReadonly();

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.base).pipe(
      tap(data => this._todos.set(data))
    );
  }

  getTodo(id: string): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.base}/${id}`);
  }

  createTodo(dto: TodoDto): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.base, dto).pipe(
      tap(todo => this._todos.update(todos => [todo, ...todos]))
    );
  }

  updateTodo(id: string, dto: Partial<TodoDto & { completado: boolean }>): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.base}/${id}`, dto).pipe(
      tap(updated => this._todos.update(todos => todos.map(t => t._id === id ? updated : t)))
    );
  }

  deleteTodo(id: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => this._todos.update(todos => todos.filter(t => t._id !== id)))
    );
  }

  createSubItem(todoId: string, dto: SubItemDto): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${this.base}/${todoId}/subitems`, dto).pipe(
      tap(updated => this._todos.update(todos => todos.map(t => t._id === todoId ? updated : t)))
    );
  }

  updateSubItem(
    todoId: string,
    subId: string,
    dto: Partial<SubItemDto & { completado: boolean }>
  ): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.base}/${todoId}/subitems/${subId}`, dto).pipe(
      tap(updated => this._todos.update(todos => todos.map(t => t._id === todoId ? updated : t)))
    );
  }

  deleteSubItem(todoId: string, subId: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${todoId}/subitems/${subId}`).pipe(
      tap(() =>
        this._todos.update(todos =>
          todos.map(t => {
            if (t._id !== todoId) return t;
            return { ...t, subItems: t.subItems.filter(s => s._id !== subId) };
          })
        )
      )
    );
  }
}

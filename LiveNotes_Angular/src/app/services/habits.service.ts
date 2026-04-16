import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Habit {
  _id: string;
  name: string;
  rachaActual: number;
  rachaMasLarga: number;
  ultimoHecho: string | null;
}

export interface HabitDto {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class HabitsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/habits`;

  private readonly _habits = signal<Habit[]>([]);
  readonly habits = this._habits.asReadonly();

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.base).pipe(
      tap(data => this._habits.set(data))
    );
  }

  createHabit(dto: HabitDto): Observable<Habit> {
    return this.http.post<Habit>(this.base, dto).pipe(
      tap(habit => this._habits.update(habits => [...habits, habit]))
    );
  }

  deleteHabit(id: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => this._habits.update(habits => habits.filter(h => h._id !== id)))
    );
  }

  markHabit(id: string): Observable<Habit> {
    return this.http.patch<Habit>(`${this.base}/${id}/marcar`, {}).pipe(
      tap(updated => this._habits.update(habits => habits.map(h => h._id === id ? updated : h)))
    );
  }
}

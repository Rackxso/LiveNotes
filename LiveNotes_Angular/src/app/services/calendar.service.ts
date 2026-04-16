import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CalendarEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  allDay?: boolean;
  color?: string;
  notes?: string;
}

export interface CalendarEventDto {
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  allDay?: boolean;
  color?: string;
  notes?: string;
}

export interface MoodEntry {
  _id: string;
  date: string;
  score: number;
  emotions?: string[];
  energy?: number;
  notes?: string;
}

export interface MoodEntryDto {
  date: string;
  score: number;
  emotions?: string[];
  energy?: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  private readonly _events = signal<CalendarEvent[]>([]);
  readonly events = this._events.asReadonly();

  private readonly _moodEntries = signal<MoodEntry[]>([]);
  readonly moodEntries = this._moodEntries.asReadonly();

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.base}/calendar`).pipe(
      tap(data => this._events.set(data))
    );
  }

  createEvent(dto: CalendarEventDto): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.base}/calendar`, dto).pipe(
      tap(ev => this._events.update(evs => [...evs, ev]))
    );
  }

  updateEvent(id: string, dto: Partial<CalendarEventDto>): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.base}/calendar/${id}`, dto).pipe(
      tap(updated => this._events.update(evs => evs.map(e => e._id === id ? updated : e)))
    );
  }

  deleteEvent(id: string): Observable<unknown> {
    return this.http.delete(`${this.base}/calendar/${id}`).pipe(
      tap(() => this._events.update(evs => evs.filter(e => e._id !== id)))
    );
  }

  getMoodEntries(): Observable<MoodEntry[]> {
    return this.http.get<MoodEntry[]>(`${this.base}/mood`).pipe(
      tap(data => this._moodEntries.set(data))
    );
  }

  createMoodEntry(dto: MoodEntryDto): Observable<MoodEntry> {
    return this.http.post<MoodEntry>(`${this.base}/mood`, dto).pipe(
      tap(entry => this._moodEntries.update(entries => [entry, ...entries]))
    );
  }
}

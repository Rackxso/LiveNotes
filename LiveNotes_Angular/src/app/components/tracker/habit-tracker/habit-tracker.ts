import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HabitsService, Habit } from '../../../services/habits.service';
import { I18nService } from '../../../services/i18n.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';
import { AddHabitModal } from '../add-habit-modal/add-habit-modal';

@Component({
  selector: 'app-habit-tracker',
  imports: [PrimaryButton, AddHabitModal],
  templateUrl: './habit-tracker.html',
  styleUrl: './habit-tracker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitTracker {
  private readonly habitsService = inject(HabitsService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly habits = this.habitsService.habits;
  readonly showModal = signal(false);

  private readonly today = new Date();

  readonly WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  readonly currentMonthDays = computed<number[]>(() => {
    const daysInMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  });

  readonly currentWeekDays = computed<Date[]>(() => {
    const diff = (this.today.getDay() + 6) % 7;
    const monday = new Date(this.today);
    monday.setDate(this.today.getDate() - diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  });

  isToday(date: Date): boolean {
    return (
      date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear()
    );
  }

  dotForDate(habit: Habit, date: Date): boolean {
    if (!habit.ultimoHecho || habit.rachaActual <= 0) return false;
    const last = new Date(habit.ultimoHecho);
    last.setHours(0, 0, 0, 0);
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);
    if (check > last) return false;
    const start = new Date(last);
    start.setDate(last.getDate() - habit.rachaActual + 1);
    start.setHours(0, 0, 0, 0);
    return check >= start;
  }

  isDoneToday(habit: Habit): boolean {
    if (!habit.ultimoHecho) return false;
    const last = new Date(habit.ultimoHecho);
    return (
      last.getFullYear() === this.today.getFullYear() &&
      last.getMonth() === this.today.getMonth() &&
      last.getDate() === this.today.getDate()
    );
  }

  dotForDay(habit: Habit, dayNum: number): boolean {
    if (!habit.ultimoHecho || habit.rachaActual <= 0) return false;
    const last = new Date(habit.ultimoHecho);
    const lastDay = last.getDate();
    const lastMonth = last.getMonth();
    const lastYear = last.getFullYear();

    if (lastMonth !== this.today.getMonth() || lastYear !== this.today.getFullYear()) return false;

    const streakStart = lastDay - habit.rachaActual + 1;
    return dayNum >= streakStart && dayNum <= lastDay;
  }

  mark(id: string): void {
    this.habitsService.markHabit(id).subscribe();
  }
}

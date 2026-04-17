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

  readonly currentMonthDays = computed<number[]>(() => {
    const daysInMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  });

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

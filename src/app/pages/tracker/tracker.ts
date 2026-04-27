import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HabitsService } from '../../services/habits.service';
import { CalendarService } from '../../services/calendar.service';
import { I18nService } from '../../services/i18n.service';
import { Header } from '../../components/header/header';
import { HabitTracker } from '../../components/tracker/habit-tracker/habit-tracker';
import { MoodTracker } from '../../components/tracker/mood-tracker/mood-tracker';

@Component({
  selector: 'app-tracker',
  imports: [Header, HabitTracker, MoodTracker],
  templateUrl: './tracker.html',
  styleUrl: './tracker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tracker {
  private readonly habitsService = inject(HabitsService);
  private readonly calendarService = inject(CalendarService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly pageTitle = computed(() => this.t()('tracker.pageTitle'));

  constructor() {
    this.habitsService.getHabits().subscribe();
    this.calendarService.getMoodEntries().subscribe();
  }
}

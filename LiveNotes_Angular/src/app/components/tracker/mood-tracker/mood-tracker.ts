import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CalendarService, MoodEntry } from '../../../services/calendar.service';
import { I18nService } from '../../../services/i18n.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';

interface MoodOption {
  key: string;
  icon: string;
  color: string;
  score: number;
}

@Component({
  selector: 'app-mood-tracker',
  imports: [PrimaryButton, TitleCasePipe],
  templateUrl: './mood-tracker.html',
  styleUrl: './mood-tracker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoodTracker {
  private readonly calendarService = inject(CalendarService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly moodEntries = this.calendarService.moodEntries;
  readonly selectedMood = signal<string | null>(null);
  readonly notes = signal('');
  readonly saving = signal(false);

  private readonly today = new Date();

  readonly MOODS: MoodOption[] = [
    { key: 'happy',     icon: 'fa-regular fa-face-smile',     color: 'var(--green)',        score: 5 },
    { key: 'angry',     icon: 'fa-regular fa-face-angry',     color: 'var(--red)',          score: 2 },
    { key: 'sad',       icon: 'fa-regular fa-face-sad-tear',  color: 'var(--blue)',         score: 1 },
    { key: 'motivated', icon: 'fa-solid fa-bolt',             color: 'var(--purple)',       score: 4 },
    { key: 'excited',   icon: 'fa-regular fa-face-grin-stars',color: 'var(--orange)',       score: 5 },
    { key: 'calm',      icon: 'fa-regular fa-face-meh',       color: 'var(--accent-color)', score: 3 },
  ];

  readonly currentMonthDays = computed<number[]>(() => {
    const daysInMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  });

  readonly firstDayOfMonth = computed<number>(() => {
    const d = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    return (d.getDay() + 6) % 7; // 0=Mon … 6=Sun
  });

  readonly calendarCells = computed<(number | null)[]>(() => [
    ...Array(this.firstDayOfMonth()).fill(null),
    ...this.currentMonthDays(),
  ]);

  readonly currentMonthName = computed<string>(() =>
    new Date(this.today.getFullYear(), this.today.getMonth(), 1)
      .toLocaleString('default', { month: 'long' })
      .replace(/^\w/, c => c.toUpperCase())
  );

  readonly moodDistribution = computed(() =>
    this.MOODS.map(m => ({
      key: m.key,
      color: m.color,
      count: this.currentMonthEntries().filter(e => e.emotions?.[0] === m.key).length,
    })).filter(m => m.count > 0)
  );

  readonly currentMonthEntries = computed<MoodEntry[]>(() =>
    this.moodEntries().filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === this.today.getMonth() && d.getFullYear() === this.today.getFullYear();
    })
  );

  readonly todayEntry = computed<MoodEntry | undefined>(() =>
    this.currentMonthEntries().find(e => {
      const d = new Date(e.date);
      return d.getDate() === this.today.getDate();
    })
  );

  readonly alreadySaved = computed(() => !!this.todayEntry());

  readonly moodStreak = computed<number>(() => {
    const entries = this.moodEntries();
    if (entries.length === 0) return 0;

    let streak = 0;
    const check = new Date(this.today);

    while (true) {
      const dateStr = check.toISOString().slice(0, 10);
      const found = entries.some(e => e.date.slice(0, 10) === dateStr);
      if (!found) break;
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  });

  readonly dominantMood = computed<string | null>(() => {
    const entries = this.currentMonthEntries();
    if (entries.length === 0) return null;
    const counts = new Map<string, number>();
    for (const e of entries) {
      const mood = e.emotions?.[0];
      if (mood) counts.set(mood, (counts.get(mood) ?? 0) + 1);
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [key, count] of counts) {
      if (count > bestCount) { bestCount = count; best = key; }
    }
    return best;
  });

  readonly dominantMoodLabel = computed<string>(() => {
    const mood = this.dominantMood();
    if (!mood) return '–';
    const key = `tracker.mood${mood.charAt(0).toUpperCase()}${mood.slice(1)}` as Parameters<ReturnType<typeof this.t>>[0];
    return this.t()(key) ?? mood;
  });

  moodColorForDay(dayNum: number): string | null {
    const entry = this.currentMonthEntries().find(e => {
      const d = new Date(e.date);
      return d.getDate() === dayNum;
    });
    if (!entry || !entry.emotions?.[0]) return null;
    const mood = this.MOODS.find(m => m.key === entry.emotions![0]);
    return mood?.color ?? null;
  }

  save(): void {
    const mood = this.selectedMood();
    if (!mood) return;
    this.saving.set(true);
    const m = this.MOODS.find(x => x.key === mood)!;
    const dateStr = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;
    this.calendarService.createMoodEntry({
      date: dateStr,
      score: m.score,
      emotions: [mood],
      notes: this.notes(),
    }).subscribe({
      complete: () => this.saving.set(false),
    });
  }

  onNotesInput(event: Event): void {
    this.notes.set((event.target as HTMLTextAreaElement).value);
  }
}

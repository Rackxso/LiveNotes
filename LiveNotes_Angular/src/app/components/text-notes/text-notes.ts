import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-text-notes',
  imports: [],
  templateUrl: './text-notes.html',
  styleUrl: './text-notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextNotes implements OnInit {
  private readonly notesService = inject(NotesService);

  readonly searchQuery = input<string>('');
  readonly addNote = output<void>();

  readonly notes = this.notesService.notes;

  ngOnInit(): void {
    this.notesService.getNotes().subscribe();
  }

  readonly filteredNotes = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.notes();
    return this.notes().filter(n =>
      n.titulo.toLowerCase().includes(q) || n.contenido.toLowerCase().includes(q)
    );
  });
}

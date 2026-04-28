import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';
import { AddNoteModal } from '../../components/commons/add-note-modal/add-note-modal';
import { PrimaryButton } from '../../components/commons/primary-button/primary-button';
import { I18nService } from '../../services/i18n.service';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'app-notes',
  imports: [Header, ToDo, TextNotes, AddNoteModal, PrimaryButton],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes {
  private readonly i18n = inject(I18nService);
  private readonly notesService = inject(NotesService);
  readonly t = this.i18n.t;
  readonly nombreVista = computed(() => this.t()('notes.pageTitle'));

  readonly notesSearch = signal('');
  readonly todosSearch = signal('');
  readonly notesSearchOpen = signal(false);
  readonly todosSearchOpen = signal(false);
  readonly showAddNoteModal = signal(false);
  readonly selectedCategory = signal<string>('all');
  readonly addingCategory = signal(false);
  readonly newCategoryInput = signal('');

  readonly categories = computed(() => {
    const unique = [...new Set(
      this.notesService.notes()
        .map(n => n.categoria)
        .filter(c => !!c)
    )];
    return unique;
  });

  readonly editingNote = signal<Note | null>(null);

  openAddNoteModal(): void {
    this.editingNote.set(null);
    this.showAddNoteModal.set(true);
  }

  openEditNoteModal(note: Note): void {
    this.editingNote.set(note);
    this.showAddNoteModal.set(true);
  }

  closeAddNoteModal(): void {
    this.showAddNoteModal.set(false);
    this.editingNote.set(null);
  }

  closeNotesSearch(): void {
    this.notesSearchOpen.set(false);
    this.notesSearch.set('');
  }

  closeTodosSearch(): void {
    this.todosSearchOpen.set(false);
    this.todosSearch.set('');
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  startAddingCategory(): void {
    this.addingCategory.set(true);
    this.newCategoryInput.set('');
  }

  confirmNewCategory(): void {
    const name = this.newCategoryInput().trim();
    if (name) {
      this.selectedCategory.set(name);
    }
    this.addingCategory.set(false);
  }

  cancelNewCategory(): void {
    this.addingCategory.set(false);
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';
import { AddNoteModal } from '../../components/commons/add-note-modal/add-note-modal';
import { PrimaryButton } from '../../components/commons/primary-button/primary-button';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-notes',
  imports: [Header, ToDo, TextNotes, AddNoteModal, PrimaryButton],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  readonly nombreVista = computed(() => this.t()('notes.pageTitle'));

  readonly notesSearch = signal('');
  readonly todosSearch = signal('');
  readonly showAddNoteModal = signal(false);

  openAddNoteModal(): void {
    this.showAddNoteModal.set(true);
  }

  closeAddNoteModal(): void {
    this.showAddNoteModal.set(false);
  }
}

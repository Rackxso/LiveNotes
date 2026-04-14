import { Component, computed, inject } from '@angular/core';
import { Header } from '../../components/header/header';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-notes',
  imports: [Header, ToDo, TextNotes],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  private readonly i18n = inject(I18nService);
  public nombreVista = computed(() => this.i18n.t()('notes.pageTitle'));
}

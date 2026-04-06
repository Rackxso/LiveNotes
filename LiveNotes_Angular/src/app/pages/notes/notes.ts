import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';

@Component({
  selector: 'app-notes',
  imports: [Header, ToDo, TextNotes],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  public nombreVista = signal<string>("Notes");
}

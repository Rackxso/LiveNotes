import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Note {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
}

@Component({
  selector: 'app-text-notes',
  imports: [],
  templateUrl: './text-notes.html',
  styleUrl: './text-notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextNotes {
  readonly notes: Note[] = [
    { id: 1, category: 'Work',     categoryColor: 'var(--blue)',   title: 'Reunión con el cliente' },
    { id: 2, category: 'Personal', categoryColor: 'var(--purple)', title: 'Ideas para el aniversario' },
    { id: 3, category: 'Health',   categoryColor: 'var(--green)',  title: 'Cita médica 20/3' },
    { id: 4, category: 'Work',     categoryColor: 'var(--blue)',   title: 'Restaurantes para la cena de empresa' },
  ];
}

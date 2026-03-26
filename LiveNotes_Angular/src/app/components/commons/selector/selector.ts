import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-selector',
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.css',
})
export class Selector implements AfterViewInit, OnDestroy {
  @Input() vistas: string[] = [];
  @Output() vistaSeleccionada = new EventEmitter<string>();

  private resizeObserver!: ResizeObserver;
  private transitionTimeout: any;

  constructor(private host: ElementRef) { }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.quitarTransicion();
    });
    this.resizeObserver.observe(this.host.nativeElement);
  }

  cambiarvista(event: Event): void {
    this.activarTransicion();

    document.querySelectorAll('.menu div').forEach((element) => {
      element.classList.remove('active');
    });
    const el = event?.target as HTMLElement;
    el?.classList.add('active');
    this.vistaSeleccionada.emit(el?.innerText.trim());
  }

  private activarTransicion() {
    const highlight = this.host.nativeElement.querySelector('.highlight');
    if (!highlight) return;
    highlight.classList.add('is-animating');
    clearTimeout(this.transitionTimeout);
    this.transitionTimeout = setTimeout(() => {
      highlight.classList.remove('is-animating');
    }, 200); // igual que la duración de tu transition
  }

  private quitarTransicion() {
    const highlight = this.host.nativeElement.querySelector('.highlight');
    if (!highlight) return;
    highlight.classList.remove('is-animating');
    clearTimeout(this.transitionTimeout);
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    clearTimeout(this.transitionTimeout);
  }
}
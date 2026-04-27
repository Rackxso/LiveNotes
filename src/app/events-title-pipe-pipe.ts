import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventsTitlePipe',
})
export class EventsTitlePipe implements PipeTransform {
  transform(value: Date | string | number, locale: string = 'en-US'): string {
    const date = value instanceof Date ? value : new Date(value);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };

    return date.toLocaleDateString(locale, options);
  }
}

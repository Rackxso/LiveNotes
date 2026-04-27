import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const lang = inject(I18nService).lang();
  return next(req.clone({ setHeaders: { 'Accept-Language': lang } }));
};

import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { TranslateService } from './translate.service';

/**
 * Translates a key: `{{ 'table.filters.search' | t }}`.
 *
 * Supports `{placeholder}` interpolation: `{{ 'x' | t:{ id: row.id } }}`.
 *
 * The pipe is impure on purpose. A pure pipe caches its output for a given
 * input, so it would keep returning the previous language after a locale
 * switch: `transform` never runs again, because its argument (the key) did not
 * change. The lookup itself is a single `Map.get`, so the cost of impurity
 * here is negligible.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(key: string, params?: Record<string, unknown>): string {
    return this.translate.text(key, params);
  }
}

/**
 * Same as {@link TranslatePipe} but returns trusted HTML, for the few phrases
 * that embed inline markup (`<code>`, `<strong>`, `<br>`).
 */
@Pipe({ name: 'tHtml', pure: false })
export class TranslateHtmlPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);

  transform(key: string, params?: Record<string, unknown>): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.translate.html(key, params));
  }
}

import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { LOCALE_TAGS, DE } from './locales';
import { TranslateService } from './translate.service';

/**
 * Locale-aware replacements for Angular's formatting pipes.
 *
 * `LOCALE_ID` is resolved once, at bootstrap, so the stock pipes would keep
 * formatting German numbers and dates after a language switch. These variants
 * default their `locale` argument to the active app locale instead, which
 * means templates keep using `| date`, `| currency`, `| number`, `| percent`
 * unchanged — just imported from here rather than from `CommonModule`.
 *
 * They delegate to a stock pipe rather than extending it: the Angular pipes
 * declare `transform` as an overload set, which a subclass cannot narrow.
 *
 * Like `TranslatePipe` they are impure, because a pure pipe would cache the
 * first result and never re-run for an unchanged input.
 */

@Pipe({ name: 'date', pure: false })
export class AppDatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly delegate = new DatePipe(LOCALE_TAGS[DE]);

  transform(
    value: string | number | Date,
    format?: string,
    timezone?: string,
    locale?: string,
  ): string | null {
    return this.delegate.transform(value, format, timezone, locale ?? this.translate.localeTag());
  }
}

@Pipe({ name: 'currency', pure: false })
export class AppCurrencyPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly delegate = new CurrencyPipe(LOCALE_TAGS[DE]);

  transform(
    value: number | string,
    currencyCode?: string,
    display?: string | boolean,
    digitsInfo?: string,
    locale?: string,
  ): string | null {
    return this.delegate.transform(
      value,
      currencyCode,
      display,
      digitsInfo,
      locale ?? this.translate.localeTag(),
    );
  }
}

@Pipe({ name: 'number', pure: false })
export class AppNumberPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly delegate = new DecimalPipe(LOCALE_TAGS[DE]);

  transform(value: string | number, digitsInfo?: string, locale?: string): string | null {
    return this.delegate.transform(value, digitsInfo, locale ?? this.translate.localeTag());
  }
}

@Pipe({ name: 'percent', pure: false })
export class AppPercentPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly delegate = new PercentPipe(LOCALE_TAGS[DE]);

  transform(value: string | number, digitsInfo?: string, locale?: string): string | null {
    return this.delegate.transform(value, digitsInfo, locale ?? this.translate.localeTag());
  }
}

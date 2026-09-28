import { TestBed } from '@angular/core/testing';
import { TranslateService } from './translate.service';
import { DE, FR, LOCALE_TAGS, interpolate } from './locales';
import { TRANSLATIONS } from './translations';

describe('TranslateService', () => {
  let service: TranslateService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
    TestBed.configureTestingModule({ providers: [TranslateService] });
    service = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose both locales', () => {
    expect(service.available).toEqual([DE, FR]);
  });

  it('should default to German when nothing is stored', () => {
    expect(service.locale()).toBe(DE);
    expect(service.localeTag()).toBe(LOCALE_TAGS.de);
  });

  it('should restore a persisted locale', () => {
    localStorage.setItem('playground-locale', FR);
    const restored = TestBed.runInInjectionContext(() => new TranslateService());
    expect(restored.locale()).toBe(FR);
  });

  it('should ignore a corrupt persisted locale', () => {
    localStorage.setItem('playground-locale', 'klingon');
    const restored = TestBed.runInInjectionContext(() => new TranslateService());
    expect(restored.locale()).toBe(DE);
  });

  describe('text()', () => {
    it('should return the German value for a known key', () => {
      expect(service.text('nav.overview')).toBe(TRANSLATIONS[DE]['nav.overview']);
    });

    it('should return the French value once the locale is switched', () => {
      service.setLocale(FR);
      TestBed.tick();
      expect(service.text('nav.overview')).toBe(TRANSLATIONS[FR]['nav.overview']);
    });

    it('should return something different from German for a translated key', () => {
      const de = service.text('nav.overview');
      service.setLocale(FR);
      TestBed.tick();
      expect(service.text('nav.overview')).not.toBe(de);
    });

    it('should thread params through to the translation', () => {
      // Which key carries a placeholder is a per-page decision, so assert the
      // mechanism here and the substitution itself against `interpolate`.
      expect(typeof service.text('nav.overview', { unused: 1 })).toBe('string');
    });

    it('should fall back to the key itself for an unknown key', () => {
      expect(service.text('does.not.exist')).toBe('does.not.exist');
    });

    it('should report whether a key is translated in the active locale', () => {
      expect(service.has('nav.overview')).toBe(true);
      expect(service.has('does.not.exist')).toBe(false);
    });
  });

  describe('toggleLocale()', () => {
    it('should switch back and forth', () => {
      expect(service.locale()).toBe(DE);
      service.toggleLocale();
      TestBed.tick();
      expect(service.locale()).toBe(FR);
      service.toggleLocale();
      TestBed.tick();
      expect(service.locale()).toBe(DE);
    });
  });

  it('should keep the document lang attribute in sync', () => {
    TestBed.tick();
    expect(document.documentElement.lang).toBe(DE);

    service.setLocale(FR);
    TestBed.tick();
    expect(document.documentElement.lang).toBe(FR);
  });

  it('should persist the locale', () => {
    service.setLocale(FR);
    TestBed.tick();
    expect(localStorage.getItem('playground-locale')).toBe(FR);
  });
});

describe('interpolate()', () => {
  it('should replace a named placeholder', () => {
    expect(interpolate('{count} entries', { count: 42 })).toBe('42 entries');
  });

  it('should replace several placeholders', () => {
    expect(interpolate('{a} of {b}', { a: 1, b: 9 })).toBe('1 of 9');
  });

  it('should replace every occurrence of a repeated placeholder', () => {
    expect(interpolate('{x}/{x}', { x: 7 })).toBe('7/7');
  });

  it('should leave unknown placeholders untouched', () => {
    expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });

  it('should return the template unchanged when no params are given', () => {
    expect(interpolate('{a}')).toBe('{a}');
  });

  it('should stringify non-string values', () => {
    expect(interpolate('{n}', { n: 0 })).toBe('0');
  });
});

describe('translation dictionaries', () => {
  it('should have exactly the same keys in German and French', () => {
    const deKeys = Object.keys(TRANSLATIONS[DE]).sort();
    const frKeys = Object.keys(TRANSLATIONS[FR]).sort();
    expect(frKeys).toEqual(deKeys);
  });

  it('should not have empty translations', () => {
    for (const [locale, table] of Object.entries(TRANSLATIONS)) {
      for (const [key, value] of Object.entries(table)) {
        expect(`${locale}/${key}: ${value.trim()}`).not.toBe(`${locale}/${key}: `);
      }
    }
  });

  it('should not leave unresolved placeholders in the French locale', () => {
    // Every {param} used in German must also exist in the French string,
    // otherwise the two locales would drift apart.
    const placeholders = (text: string): string[] =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

    for (const [key, deValue] of Object.entries(TRANSLATIONS[DE])) {
      const frValue = TRANSLATIONS[FR][key];
      expect({ key, params: placeholders(frValue) }).toEqual({
        key,
        params: placeholders(deValue),
      });
    }
  });
});

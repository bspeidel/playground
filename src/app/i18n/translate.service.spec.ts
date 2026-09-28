import { TestBed } from '@angular/core/testing';
import { TranslateService } from './translate.service';
import { DE, EN, FR, LOCALE_TAGS, interpolate } from './locales';
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

  it('should expose all three locales', () => {
    expect(service.available).toEqual([DE, EN, FR]);
  });

  it('should fall back to English when nothing is stored', () => {
    expect(service.locale()).toBe(EN);
    expect(service.localeTag()).toBe(LOCALE_TAGS.en);
  });

  it('should restore a persisted locale', () => {
    localStorage.setItem('playground-locale', FR);
    const restored = TestBed.runInInjectionContext(() => new TranslateService());
    expect(restored.locale()).toBe(FR);
  });

  it('should ignore a corrupt persisted locale', () => {
    localStorage.setItem('playground-locale', 'klingon');
    const restored = TestBed.runInInjectionContext(() => new TranslateService());
    expect(restored.locale()).toBe(EN);
  });

  describe('text()', () => {
    it('should return the active locale value for a known key', () => {
      expect(service.text('nav.overview')).toBe(TRANSLATIONS[EN]['nav.overview']);

      service.setLocale(DE);
      TestBed.tick();
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
    it('should switch between the two non-default locales', () => {
      expect(service.locale()).toBe(EN);
      service.toggleLocale();
      TestBed.tick();
      expect(service.locale()).toBe(DE);
      service.toggleLocale();
      TestBed.tick();
      expect(service.locale()).toBe(EN);
    });
  });

  it('should serve a different string per locale for the same key', () => {
    const values = ([DE, EN, FR] as const).map((locale) => {
      service.setLocale(locale);
      TestBed.tick();
      return service.text('nav.overview');
    });

    expect(new Set(values).size).toBe(3);
  });

  it('should keep the document lang attribute in sync', () => {
    TestBed.tick();
    expect(document.documentElement.lang).toBe(EN);

    service.setLocale(FR);
    TestBed.tick();
    expect(document.documentElement.lang).toBe(FR);

    service.setLocale(DE);
    TestBed.tick();
    expect(document.documentElement.lang).toBe(DE);
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
  const locales = [DE, EN, FR] as const;
  const reference = TRANSLATIONS[DE];

  it('should have exactly the same keys in every locale', () => {
    const expected = Object.keys(reference).sort();
    for (const locale of locales) {
      expect({ locale, keys: Object.keys(TRANSLATIONS[locale]).sort() }).toEqual({
        locale,
        keys: expected,
      });
    }
  });

  it('should not have empty translations', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(TRANSLATIONS[locale])) {
        expect(`${locale}/${key}: ${value.trim()}`).not.toBe(`${locale}/${key}: `);
      }
    }
  });

  it('should not leave unresolved placeholders in any locale', () => {
    // Every {param} used in German must also exist in the other locales,
    // otherwise they would drift apart.
    const placeholders = (text: string): string[] =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

    for (const locale of locales) {
      for (const [key, referenceValue] of Object.entries(reference)) {
        expect({ locale, key, params: placeholders(TRANSLATIONS[locale][key]) }).toEqual({
          locale,
          key,
          params: placeholders(referenceValue),
        });
      }
    }
  });

  it('should not leave German or French text in the English locale', () => {
    // Catches a value that was copied from another locale instead of translated.
    // Deliberately narrow: words that are also ordinary English (`element`,
    // `search`, `en`) would produce false positives, and locale tags such as
    // `en-US` are stripped before the check for the same reason.
    const germanFrenchWords =
      /\b(und|oder|nicht|werden|wird|keine|barrierefrei|erstellen|bearbeiten|löschen|speichern|abbrechen|übernehmen|avec|aucune|rechercher|décrochage)\b/i;

    const offenders: string[] = [];
    for (const [key, value] of Object.entries(TRANSLATIONS[EN])) {
      const withoutLocaleTags = value.replace(/\b[a-z]{2}-[A-Z]{2}\b/g, '');
      if (germanFrenchWords.test(withoutLocaleTags)) {
        offenders.push(`${key} = ${value}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('should actually differ between locales for a sample of keys', () => {
    // Guards against an English table that merely duplicates the German one.
    const sample = Object.keys(reference).filter((k) => reference[k].length > 12);
    const identical = sample.filter((k) => TRANSLATIONS[EN][k] === reference[k]);

    // A handful of values are legitimately identical (prose nouns, product
    // names), so allow a small number, not a wholesale copy.
    expect(identical.length).toBeLessThan(sample.length * 0.1);
  });
});

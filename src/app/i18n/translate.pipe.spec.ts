import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { TranslateHtmlPipe, TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';
import { DE, FR } from './locales';
import { TRANSLATIONS } from './translations';

@Component({
  selector: 'app-host',
  imports: [TranslatePipe, TranslateHtmlPipe],
  template: `
    <span class="plain">{{ 'nav.overview' | t }}</span>
    <span class="with-params">{{ 'nav.overview' | t: { extra: n() } }}</span>
    <span class="html" [innerHTML]="'shell.footer' | tHtml"></span>
  `,
})
class HostComponent {
  readonly n = signal(1234);
}

describe('TranslatePipe', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [TranslateService],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  function render(): { de: string; params: string; html: string } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    return {
      de: host.querySelector('.plain')!.textContent!.trim(),
      params: host.querySelector('.with-params')!.textContent!.trim(),
      html: host.querySelector('.html')!.innerHTML,
    };
  }

  it('should translate a key', () => {
    expect(render().de).toBe(TRANSLATIONS[DE]['nav.overview']);
  });

  /**
   * The pipe is impure precisely so this works: a pure pipe would keep the
   * cached German string because its input (the key) did not change.
   */
  it('should re-translate after a locale switch without the input changing', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const plain = host.querySelector('.plain')!;

    expect(plain.textContent!.trim()).toBe(TRANSLATIONS[DE]['nav.overview']);

    TestBed.inject(TranslateService).setLocale(FR);
    fixture.detectChanges();

    expect(plain.textContent!.trim()).toBe(TRANSLATIONS[FR]['nav.overview']);
  });

  it('should accept a params argument', () => {
    // `nav.overview` has no placeholder, so params are simply unused here.
    // The substitution logic itself is covered in translate.service.spec.ts.
    expect(render().params).toBe(TRANSLATIONS[DE]['nav.overview']);
  });

  it('should render markup for tHtml', () => {
    // The footer is plain text, so it should not gain any elements.
    expect(render().html).not.toContain('<');
  });
});

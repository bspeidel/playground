import { TestBed } from '@angular/core/testing';
import { DeferDemoPage } from './defer-demo';

describe('DeferDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeferDemoPage],
    }).compileComponents();
  });

  function create(): DeferDemoPage {
    const fixture = TestBed.createComponent(DeferDemoPage);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create the defer demo page', () => {
    expect(create()).toBeTruthy();
  });

  it('should render the page heading', () => {
    const fixture = TestBed.createComponent(DeferDemoPage);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    // English is the default locale, so the heading renders in English.
    expect(host.querySelector('h1')?.textContent).toContain('Deferrable views');
  });

  it('should render the deferred placeholders before their triggers fire', () => {
    const fixture = TestBed.createComponent(DeferDemoPage);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    // @defer blocks emit a placeholder until their trigger resolves.
    expect(
      host.querySelectorAll('[class*="placeholder"], .defer-placeholder').length,
    ).toBeGreaterThan(0);
  });
});

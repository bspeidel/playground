import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  function createService(): ThemeService {
    TestBed.configureTestingModule({ providers: [ThemeService] });
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
  });

  it('should be created', () => {
    service = createService();
    expect(service).toBeTruthy();
  });

  it('should default to light when nothing is stored', () => {
    service = createService();
    expect(service.isDark()).toBe(false);
  });

  it('should restore a persisted dark theme on construction', () => {
    localStorage.setItem('playground-theme', 'dark');
    service = createService();
    expect(service.isDark()).toBe(true);
  });

  it('should restore a persisted light theme on construction', () => {
    localStorage.setItem('playground-theme', 'light');
    service = createService();
    expect(service.isDark()).toBe(false);
  });

  it('should ignore a corrupt stored value', () => {
    localStorage.setItem('playground-theme', 'banana');
    service = createService();
    expect(service.isDark()).toBe(false);
  });

  it('should toggle the signal both ways', () => {
    service = createService();
    const initial = service.isDark();

    service.toggleTheme();
    expect(service.isDark()).toBe(!initial);

    service.toggleTheme();
    expect(service.isDark()).toBe(initial);
  });

  it('should apply the dark-theme class to the document element', () => {
    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
    TestBed.tick();

    if (!service.isDark()) {
      service.toggleTheme();
      TestBed.tick();
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);

      service.toggleTheme();
      TestBed.tick();
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    }
  });

  it('should persist the mode on toggle', () => {
    service = createService();
    service.toggleTheme();
    TestBed.tick();

    expect(localStorage.getItem('playground-theme')).toBe(service.isDark() ? 'dark' : 'light');
  });
});

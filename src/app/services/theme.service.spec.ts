import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme signal', () => {
    const initial = service.isDark();
    service.toggleTheme();
    expect(service.isDark()).toBe(!initial);
    service.toggleTheme();
    expect(service.isDark()).toBe(initial);
  });
});

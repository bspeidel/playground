import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ApiExplorerPage } from './api-explorer';

describe('ApiExplorerPage', () => {
  beforeEach(async () => {
    // jsdom does not expose a global `fetch`, and `resource()` fires its
    // loader on the first change detection cycle.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ total_count: 0, items: [] }),
    }) as unknown as typeof fetch;

    await TestBed.configureTestingModule({
      imports: [ApiExplorerPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function create(): ApiExplorerPage {
    return TestBed.createComponent(ApiExplorerPage).componentInstance;
  }

  /** Waits out the debounce window plus a small margin. */
  function settle(overDebounceMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, overDebounceMs + 50));
  }

  it('should create the page', () => {
    expect(create()).toBeTruthy();
  });

  it('should have initial search input and sort configured', () => {
    const component = create();
    expect(component.searchInput()).toBe('angular');
    expect(component.searchTerm()).toBe('angular');
    expect(component.selectedSort()).toBe('stars');
  });

  it('setSearch should update the raw input immediately', () => {
    const component = create();
    component.setSearch('typescript');
    expect(component.searchInput()).toBe('typescript');
  });

  it('should debounce so a burst of keystrokes settles on a single value', async () => {
    const component = create();

    // Simulate typing "typescript" one character at a time.
    for (const partial of ['t', 'ty', 'typ', 'types', 'typesc', 'typescript']) {
      component.searchInput.set(partial);
    }

    // The raw input follows every keystroke...
    expect(component.searchInput()).toBe('typescript');
    // ...but the effective term driving the request has not moved yet.
    expect(component.searchTerm()).toBe('angular');

    await settle(component.debounceMs);

    expect(component.searchTerm()).toBe('typescript');
  });

  it('should trim the debounced search term', async () => {
    const component = create();
    component.searchInput.set('  rxjs  ');

    expect(component.searchInput()).toBe('  rxjs  ');

    await settle(component.debounceMs);

    expect(component.searchTerm()).toBe('rxjs');
  });

  it('should ignore repeated identical input', async () => {
    const component = create();

    component.searchInput.set('angular');
    await settle(component.debounceMs);
    expect(component.searchTerm()).toBe('angular');
  });
});

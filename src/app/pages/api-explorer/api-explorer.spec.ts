import { TestBed } from '@angular/core/testing';
import { ApiExplorerPage } from './api-explorer';

describe('ApiExplorerPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiExplorerPage],
    }).compileComponents();
  });

  it('should create the api explorer page', () => {
    const fixture = TestBed.createComponent(ApiExplorerPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial search term and sort configured', () => {
    const fixture = TestBed.createComponent(ApiExplorerPage);
    const component = fixture.componentInstance;

    expect(component.searchTerm()).toBe('angular');
    expect(component.selectedSort()).toBe('stars');
    expect(component.abortCount()).toBe(0);
  });

  it('should update search term when setSearch is called', () => {
    const fixture = TestBed.createComponent(ApiExplorerPage);
    const component = fixture.componentInstance;

    component.setSearch('typescript');
    expect(component.searchTerm()).toBe('typescript');
  });
});

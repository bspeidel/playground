import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableDemo } from './table-demo';

describe('TableDemo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDemo],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with default projects and computed KPIs', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.items().length).toBeGreaterThan(0);
    expect(component.totalProjectsCount()).toBe(component.items().length);
    expect(component.filteredProjectsCount()).toBe(component.items().length);
    expect(component.totalBudget()).toBeGreaterThan(0);
    expect(component.avgProgress()).toBeGreaterThan(0);
  });

  it('should filter projects when searchTerm signal changes', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchTerm.set('E-commerce');
    fixture.detectChanges();

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].name).toContain('E-commerce');
    expect(component.filteredProjectsCount()).toBe(1);
  });

  it('should filter projects by status', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.statusFilter.set('Terminé');
    fixture.detectChanges();

    const finished = component.filteredItems();
    expect(finished.length).toBeGreaterThan(0);
    expect(finished.every((p) => p.status === 'Terminé')).toBe(true);
  });

  it('should toggle row selection and update selectedCount and selectedBudget', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const firstItem = component.items()[0];
    component.toggleRow(firstItem);
    fixture.detectChanges();

    expect(component.selection.isSelected(firstItem)).toBe(true);
    expect(component.selectedCount()).toBe(1);
    expect(component.selectedBudget()).toBe(firstItem.budget);

    component.toggleRow(firstItem);
    fixture.detectChanges();

    expect(component.selection.isSelected(firstItem)).toBe(false);
    expect(component.selectedCount()).toBe(0);
    expect(component.selectedBudget()).toBe(0);
  });

  it('should toggle all rows with toggleAllRows', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.toggleAllRows();
    fixture.detectChanges();

    expect(component.isAllSelected()).toBe(true);
    expect(component.selectedCount()).toBe(component.dataSource.data.length);

    component.toggleAllRows();
    fixture.detectChanges();

    expect(component.isAllSelected()).toBe(false);
    expect(component.selectedCount()).toBe(0);
  });

  it('should reset filters', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchTerm.set('xyz');
    component.statusFilter.set('Bloqué');
    component.categoryFilter.set('Web App');

    component.resetFilters();
    fixture.detectChanges();

    expect(component.searchTerm()).toBe('');
    expect(component.statusFilter()).toBe('all');
    expect(component.categoryFilter()).toBe('all');
  });

  it('should delete a project', () => {
    const fixture = TestBed.createComponent(TableDemo);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const initialCount = component.items().length;
    const target = component.items()[0];

    component.deleteProject(target);
    fixture.detectChanges();

    expect(component.items().length).toBe(initialCount - 1);
    expect(component.items().some((p) => p.id === target.id)).toBe(false);
  });
});

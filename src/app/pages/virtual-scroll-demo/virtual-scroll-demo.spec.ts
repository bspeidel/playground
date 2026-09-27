import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { VirtualScrollDemoPage } from './virtual-scroll-demo';

describe('VirtualScrollDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(VirtualScrollDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with 50,000 logs and compute metrics', () => {
    const fixture = TestBed.createComponent(VirtualScrollDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.totalItemsCount()).toBe(50000);
    expect(component.filteredLogs().length).toBe(50000);
    expect(Number(component.domReductionPercent())).toBeGreaterThan(99);
    expect(component.avgLatency()).toBeGreaterThan(0);
  });

  it('should filter logs by level', () => {
    const fixture = TestBed.createComponent(VirtualScrollDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.selectedLevel.set('ERROR');
    fixture.detectChanges();

    const filtered = component.filteredLogs();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((l) => l.level === 'ERROR')).toBe(true);
  });

  it('should filter logs by search query', () => {
    const fixture = TestBed.createComponent(VirtualScrollDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchQuery.set('auth-service');
    fixture.detectChanges();

    const filtered = component.filteredLogs();
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every((l) => l.service === 'auth-service' || l.message.includes('auth-service')),
    ).toBe(true);
  });

  it('should update dataset size when setDatasetSize is called', () => {
    const fixture = TestBed.createComponent(VirtualScrollDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.setDatasetSize(5000);
    fixture.detectChanges();

    expect(component.totalItemsCount()).toBe(5000);
    expect(component.filteredLogs().length).toBe(5000);
  });
});

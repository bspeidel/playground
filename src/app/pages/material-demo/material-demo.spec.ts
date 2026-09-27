import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MaterialDemoPage } from './material-demo';

describe('MaterialDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the material demo page', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should increment badge count when requested', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;

    expect(component.badgeCount()).toBe(5);
    component.incrementBadge();
    expect(component.badgeCount()).toBe(6);
  });

  it('should filter frameworks via autocomplete signal', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.filteredFrameworks().length).toBe(component.allFrameworks.length);

    component.frameworkSearch.set('angular');
    fixture.detectChanges();

    expect(component.filteredFrameworks()).toEqual(['Angular 22']);
  });

  it('should toggle spinner mode between determinate and indeterminate', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;

    expect(component.spinnerMode()).toBe('determinate');
    component.toggleSpinnerMode();
    expect(component.spinnerMode()).toBe('indeterminate');
    component.toggleSpinnerMode();
    expect(component.spinnerMode()).toBe('determinate');
  });

  it('should manage parent and child checkbox states with indeterminate status', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Initial state: 2 completed out of 4 -> someComplete = true, allComplete = false
    expect(component.someComplete()).toBe(true);
    expect(component.allComplete()).toBe(false);

    // Set all to true
    component.setAllTasks(true);
    fixture.detectChanges();
    expect(component.allComplete()).toBe(true);
    expect(component.someComplete()).toBe(false);

    // Set all to false
    component.setAllTasks(false);
    fixture.detectChanges();
    expect(component.allComplete()).toBe(false);
    expect(component.someComplete()).toBe(false);

    // Update single task
    component.updateTask(0, true);
    fixture.detectChanges();
    expect(component.someComplete()).toBe(true);
  });

  it('should update viewMode and speed signals', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;

    component.viewMode.set('table');
    expect(component.viewMode()).toBe('table');

    component.selectedSpeed.set('eco');
    expect(component.selectedSpeed()).toBe('eco');
  });
});

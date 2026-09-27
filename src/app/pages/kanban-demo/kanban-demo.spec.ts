import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { KanbanDemoPage } from './kanban-demo';

describe('KanbanDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with 4 columns and compute KPIs', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.columns().length).toBe(4);
    expect(component.totalTasksCount()).toBeGreaterThan(0);
    expect(component.inProgressCount()).toBeGreaterThan(0);
    expect(component.completedTasksCount()).toBeGreaterThan(0);
    expect(component.completionRate()).toBeGreaterThan(0);
  });

  it('should dim tasks when search query does not match', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const task = component.columns()[0].tasks[0];
    expect(component.isTaskDimmed(task)).toBe(false);

    component.searchQuery.set('xyz-random-non-existent');
    fixture.detectChanges();

    expect(component.isTaskDimmed(task)).toBe(true);
  });

  it('should dim tasks when priority filter does not match', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.priorityFilter.set('Critique');
    fixture.detectChanges();

    const lowPriorityTask = component.columns()[0].tasks.find((t) => t.priority === 'Basse');
    const criticalTask = component.columns()[2].tasks.find((t) => t.priority === 'Critique');

    if (lowPriorityTask) {
      expect(component.isTaskDimmed(lowPriorityTask)).toBe(true);
    }
    if (criticalTask) {
      expect(component.isTaskDimmed(criticalTask)).toBe(false);
    }
  });

  it('should move task between columns via moveTaskToColumn', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const sourceTask = component.columns()[0].tasks[0];
    const initialSourceCount = component.columns()[0].tasks.length;
    const initialTargetCount = component.columns()[1].tasks.length;

    component.moveTaskToColumn(sourceTask, 'backlog', 'todo');
    fixture.detectChanges();

    expect(component.columns()[0].tasks.length).toBe(initialSourceCount - 1);
    expect(component.columns()[1].tasks.length).toBe(initialTargetCount + 1);
    expect(component.columns()[1].tasks.some((t) => t.id === sourceTask.id)).toBe(true);
  });

  it('should delete a task from column', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const target = component.columns()[0].tasks[0];
    const initialCount = component.columns()[0].tasks.length;

    component.deleteTask(target.id, 'backlog');
    fixture.detectChanges();

    expect(component.columns()[0].tasks.length).toBe(initialCount - 1);
    expect(component.columns()[0].tasks.some((t) => t.id === target.id)).toBe(false);
  });

  it('should reset board to initial state', () => {
    const fixture = TestBed.createComponent(KanbanDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const target = component.columns()[0].tasks[0];
    component.deleteTask(target.id, 'backlog');
    component.searchQuery.set('test');
    component.priorityFilter.set('Haute');
    fixture.detectChanges();

    component.resetBoard();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    expect(component.priorityFilter()).toBe('all');
    expect(component.columns()[0].tasks.some((t) => t.id === target.id)).toBe(true);
  });
});

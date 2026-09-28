import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { KanbanDemoPage } from './kanban-demo';
import { FR, TranslateService } from '../../i18n';

describe('KanbanDemoPage', () => {
  beforeEach(async () => {
    // The locale is persisted to localStorage, so a test that switches to
    // French would otherwise leak into the next one.
    localStorage.clear();
    document.documentElement.removeAttribute('lang');

    await TestBed.configureTestingModule({
      imports: [KanbanDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
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

  describe('localized task content', () => {
    function create() {
      const fixture = TestBed.createComponent(KanbanDemoPage);
      fixture.detectChanges();
      return { fixture, component: fixture.componentInstance };
    }

    it('should render seed task titles in the active locale', () => {
      const { fixture, component } = create();
      const task = component.columns()[0].tasks[0];

      expect(task.titleKey).toBeTruthy();
      expect(component.taskTitle(task)).toBe(task.title);

      TestBed.inject(TranslateService).setLocale(FR);
      fixture.detectChanges();

      expect(component.taskTitle(task)).not.toBe(task.title);
      expect(component.taskTitle(task).length).toBeGreaterThan(0);
    });

    it('should fall back to the raw text for tasks without a key', () => {
      const { component } = create();
      const custom = { ...component.columns()[0].tasks[0], titleKey: null, descriptionKey: null };

      expect(component.taskTitle(custom)).toBe(custom.title);
      expect(component.taskDescription(custom)).toBe(custom.description);
    });

    /**
     * The search box matches the raw German strings, which must survive
     * translation — otherwise switching locale would silently break filtering.
     */
    it('should keep filtering on the raw text after a locale switch', () => {
      const { fixture, component } = create();
      const task = component.columns()[0].tasks[0];
      const query = task.title.slice(0, 6);

      TestBed.inject(TranslateService).setLocale(FR);
      fixture.detectChanges();

      component.searchQuery.set(query);
      fixture.detectChanges();

      expect(component.isTaskDimmed(task)).toBe(false);
    });

    it('should translate German tags and pass neutral tags through', () => {
      const { fixture, component } = create();

      expect(component.tagLabel('Grafik')).toBe('Grafik');
      expect(component.tagLabel('UI/UX')).toBe('UI/UX');
      expect(component.tagLabel('CDK')).toBe('CDK');

      TestBed.inject(TranslateService).setLocale(FR);
      fixture.detectChanges();

      expect(component.tagLabel('Grafik')).toBe('Graphiques');
      expect(component.tagLabel('UI/UX')).toBe('UI/UX');
    });
  });
});
